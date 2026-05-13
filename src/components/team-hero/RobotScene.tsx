"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";
import { EyeTracker } from "./EyeTracker";

const ROBOT_PATH = "/3d/flyingrobot.glb";

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

// Pre-allocated — avoid per-frame GC pressure
const CYAN = new THREE.Color("#00AAFF");
const RED_EYE = new THREE.Color("#DC2626");
const RED_EMISSIVE = new THREE.Color("#B91C1C");

const smoothstep = (x: number, min: number, max: number) => {
  const t = Math.max(0, Math.min(1, (x - min) / (max - min)));
  return t * t * (3 - 2 * t);
};

function Robot() {
  const groupRef      = useRef<THREE.Group>(null);
  const headBoneRef   = useRef<THREE.Object3D | null>(null);
  const eyeMeshesRef  = useRef<THREE.Mesh[]>([]);
  const scrollRef     = useRef(0);
  const alertMixRef   = useRef(0);
  const smoothYRef    = useRef(0);
  const { scene, animations } = useGLTF(ROBOT_PATH);
  const { actions }   = useAnimations(animations, groupRef);
  const { pointer }   = useThree();

  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.play());
  }, [actions]);

  // Unified scroll handler — spin progress, eye color, canvas fade-out
  useEffect(() => {
    const onScroll = () => {
      const problemEl = document.getElementById("problem");

      // 360 spin progress — scoped to hero zone
      if (problemEl) {
        const spinEnd = problemEl.offsetTop * 0.93;
        scrollRef.current =
          spinEnd > 0
            ? Math.max(0, Math.min(1, window.scrollY / spinEnd))
            : 0;
      }

      // Eye color trigger
      if (problemEl) {
        const triggerStart = problemEl.offsetTop - window.innerHeight * 0.45;
        const triggerRange = window.innerHeight * 0.55;
        const raw = (window.scrollY - triggerStart) / triggerRange;
        alertMixRef.current = Math.max(0, Math.min(1, raw));
      }

      // Canvas fade-out past problem section
      if (problemEl) {
        const problemBottom = problemEl.offsetTop + problemEl.offsetHeight;
        const fadeStart = problemBottom - window.innerHeight * 0.35;
        const fadeEnd   = problemBottom - window.innerHeight * 0.05;
        let opacity = 1;
        if (window.scrollY > fadeStart) {
          opacity = 1 - Math.min(1, (window.scrollY - fadeStart) / (fadeEnd - fadeStart));
        }
        const wrapper = document.getElementById("team-hero-3d-wrapper");
        if (wrapper) {
          wrapper.style.opacity = String(opacity);
          wrapper.style.transform = `translateY(-13vh)`;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Material setup — FIX 1-5 from team Robot.tsx + eyeMeshesRef tracking
  useEffect(() => {
    eyeMeshesRef.current = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const mat = child.material as THREE.MeshStandardMaterial;

      if (mat) {
        if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace;                mat.map.needsUpdate = true; }
        if (mat.emissiveMap)  { mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;        mat.emissiveMap.needsUpdate = true; }
        if (mat.envMap)       { mat.envMap.colorSpace = THREE.SRGBColorSpace;             mat.envMap.needsUpdate = true; }
        if (mat.normalMap)    { mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;    mat.normalMap.needsUpdate = true; }
        if (mat.roughnessMap) { mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace; mat.roughnessMap.needsUpdate = true; }
        if (mat.metalnessMap) { mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace; mat.metalnessMap.needsUpdate = true; }
        mat.needsUpdate = true;
      }

      const n = child.name.toLowerCase();

      // FIX 5 — Police / chest text → subtle embossed dark
      if (
        n.includes("police") || n.includes("text") ||
        n.includes("logo")   || n.includes("chest_text") ||
        n.includes("label")  || n.includes("decal")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#0f0d1a"),
          metalness: 0.8,
          roughness: 0.4,
          envMapIntensity: 1.0,
        });
        return;
      }

      // FIX 1a — Gun accent / barrel → glowing amber trim
      if (
        n.includes("barrel")      || n.includes("gun_accent") ||
        n.includes("weapon_trim") || n.includes("muzzle") ||
        n.includes("scope")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#EF9F27"),
          emissive: new THREE.Color("#EF9F27"),
          emissiveIntensity: 1.0,
          metalness: 0.3,
          roughness: 0.1,
        });
        return;
      }

      // FIX 1b — Gun body → dark gunmetal
      if (
        n.includes("gun")    || n.includes("weapon") ||
        n.includes("rifle")  || n.includes("pistol") ||
        n.includes("cannon") || n.includes("shotgun")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#1a1a2e"),
          metalness: 0.9,
          roughness: 0.35,
          envMapIntensity: 0.5,
        });
        return;
      }

      // FIX 2 — Yellow accent lights → bright gold emissive
      if (
        n.includes("yellow")       || n.includes("gold") ||
        n.includes("accent")       || n.includes("stripe") ||
        n.includes("trim")         || n.includes("band") ||
        n.includes("highlight")    || n.includes("led") ||
        n.includes("panel_light")  || n.includes("shoulder_light") ||
        n.includes("detail_light") || n.includes("neon")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#FFD700"),
          emissive: new THREE.Color("#FFD700"),
          emissiveIntensity: 2.0,
          metalness: 0.0,
          roughness: 0.0,
          toneMapped: false,
        });
        return;
      }

      // FIX 3 — Red dot / indicator → vivid glowing red
      if (
        n.includes("red")       || n.includes("dot") ||
        n.includes("indicator") || n.includes("alert") ||
        n.includes("warning")   || n.includes("signal")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#FF0000"),
          emissive: new THREE.Color("#FF2020"),
          emissiveIntensity: 1.5,
          metalness: 0.0,
          roughness: 0.0,
        });
        return;
      }

      // FIX 4 — Eyes / visor → glowing blue emissive (tracked for cyan→red lerp)
      if (
        n.includes("eye")        || n.includes("lens") ||
        n.includes("visor")      || n.includes("screen") ||
        n.includes("glass")      || n.includes("glow") ||
        n.includes("lamp")       || n.includes("sensor") ||
        n.includes("camera")     || n.includes("optic") ||
        n.includes("face_light") || n.includes("head_light") ||
        n.includes("retina")     || n.includes("pupil")
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#00AAFF"),
          emissive: new THREE.Color("#0088FF"),
          emissiveIntensity: 2.5,
          metalness: 0.0,
          roughness: 0.0,
          toneMapped: false,
        });
        eyeMeshesRef.current.push(child);
        return;
      }

      // Fallback — color-based detection for generic mesh names
      if (mat?.color) {
        const r = mat.color.r;
        const g = mat.color.g;
        const b = mat.color.b;
        const isYellow    = r > 0.6 && g > 0.5 && b < 0.3;
        const isOrangeRed = r > 0.7 && g < 0.4 && b < 0.2;
        const isGrey      = !mat.map && Math.abs(r - g) < 0.15 && Math.abs(g - b) < 0.15 && r > 0.15;
        const isBlue      = b > 0.5 && b > r * 1.5 && b > g * 0.8;
        const isCyanEmissive = mat?.emissive &&
          (mat.emissive.b > 0.3 || (mat.emissive.r < 0.1 && mat.emissive.g > 0.1));

        if (isYellow) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#FFD700"),
            emissive: new THREE.Color("#FFD700"),
            emissiveIntensity: 2.0,
            metalness: 0.0,
            roughness: 0.0,
            toneMapped: false,
          });
        } else if (isOrangeRed) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#FF4500"),
            emissive: new THREE.Color("#FF4500"),
            emissiveIntensity: 2.0,
            metalness: 0.0,
            roughness: 0.0,
            toneMapped: false,
          });
        } else if (isGrey) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#141420"),
            metalness: 0.75,
            roughness: 0.55,
          });
        } else if (isBlue || isCyanEmissive) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#00AAFF"),
            emissive: new THREE.Color("#0088FF"),
            emissiveIntensity: 2.5,
            metalness: 0.0,
            roughness: 0.0,
            toneMapped: false,
          });
          eyeMeshesRef.current.push(child);
          return;
        }
      }

      // Default — floor roughness to reduce specular hot spots
      if (mat && mat.roughness < 0.45) {
        mat.roughness = 0.45;
        mat.needsUpdate = true;
      }
    });

    // Find head bone by common rig naming conventions
    headBoneRef.current = null;
    scene.traverse((child) => {
      if (headBoneRef.current) return;
      const n = child.name.toLowerCase();
      if (
        n === "head"          || n === "mixamorighead" ||
        n === "bip_head"      || n === "bip01_head" ||
        n === "head_jnt"      || n.endsWith("_head") ||
        (n.includes("head") && !n.includes("headlight"))
      ) {
        headBoneRef.current = child;
      }
    });

    // Second pass — catch any remaining blue/cyan emissive meshes missed by name-based rules
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (eyeMeshesRef.current.includes(child)) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat?.emissive) return;
      if (mat.emissive.b > 0.2 && mat.emissive.b > mat.emissive.r) {
        eyeMeshesRef.current.push(child);
      }
    });

    console.log("[mascot] eyeMeshesRef count:", eyeMeshesRef.current.length);
  }, [scene]);

  useFrame((_state, delta) => {
    if (prefersReducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        groupRef.current.position.y = -0.35;
      }
      return;
    }
    const g = groupRef.current;
    if (!g) return;

    const problemEl  = document.getElementById("problem");
    const problemTop = problemEl?.offsetTop ?? 999999;
    const inHeroZone = window.scrollY < problemTop;

    if (isTouchDevice) {
      g.rotation.y += 0.004;
    } else if (inHeroZone) {
      // Hero zone: scroll-driven 360° spin with weighted damping
      const t      = Math.max(0, Math.min(1, scrollRef.current));
      const eased  = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const targetY    = -eased * Math.PI * 2;
      const lerpFactor = 1 - Math.pow(0.012, delta);
      smoothYRef.current = THREE.MathUtils.lerp(smoothYRef.current, targetY, lerpFactor);
      g.rotation.y = smoothYRef.current;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, lerpFactor);
    } else {
      // Problem zone — base locked at completed spin (front-facing), mouse adds small offset
      const baseY        = -Math.PI * 2;
      const mouseTargetY = baseY + pointer.x * 0.4;
      const mouseTargetX = -pointer.y * 0.2;
      g.rotation.y += (mouseTargetY - g.rotation.y) * 0.06;
      g.rotation.x += (mouseTargetX - g.rotation.x) * 0.06;
      if (headBoneRef.current) {
        headBoneRef.current.rotation.y += (pointer.x * 0.5  - headBoneRef.current.rotation.y) * 0.08;
        headBoneRef.current.rotation.x += (-pointer.y * 0.3 - headBoneRef.current.rotation.x) * 0.08;
      }
    }

    // Eye color: cyan → red, driven by scroll into problem section (always active)
    const hardMix = smoothstep(alertMixRef.current, 0.4, 0.85);
    for (const mesh of eyeMeshesRef.current) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.lerpColors(CYAN, RED_EYE, hardMix);
        mat.emissive.lerpColors(CYAN, RED_EMISSIVE, hardMix);
        mat.emissiveIntensity = THREE.MathUtils.lerp(2.5, 2.0, hardMix);
        mat.needsUpdate = true;
      }
    }

    g.position.y = -0.35;
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={[2, 2, 2]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(ROBOT_PATH);

export default function RobotScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 4], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene, camera }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.55;
        camera.lookAt(0, 1, 0);
      }}
      shadows
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.07} color="#ffffff" />
        <pointLight position={[0, 0, 6]}  color="#ffffff" intensity={0.3}  distance={15} decay={1.5} />
        <pointLight position={[-4, 0, 3]} color="#ffffff" intensity={0.25} distance={12} decay={1.5} />
        <pointLight position={[4, 0, 3]}  color="#ffffff" intensity={0.15} distance={12} decay={1.5} />

        <Robot />
        <EyeTracker />

        <Environment preset="studio" background={false} environmentIntensity={0.06} blur={1} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.88}
            luminanceSmoothing={0.9}
            intensity={0.35}
            mipmapBlur
            radius={0.5}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

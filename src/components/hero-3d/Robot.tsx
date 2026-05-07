'use client'
import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const ROBOT_PATH = '/robot/robotagent.glb'

const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function Robot() {
  const groupRef = useRef<THREE.Group>(null)
  const headBoneRef = useRef<THREE.Object3D | null>(null)
  const { scene } = useGLTF(ROBOT_PATH)
  const { pointer } = useThree()

  useEffect(() => {
    // ── STEP 1: log every mesh name + current material colours ──────────────
    console.group('=== ROBOT MESHES ===')
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const mat = child.material as THREE.MeshStandardMaterial
      console.log(
        'MESH:', child.name,
        '| color:', mat?.color?.getHexString() ?? 'n/a',
        '| emissive:', mat?.emissive?.getHexString() ?? 'n/a',
        '| metalness:', mat?.metalness ?? 'n/a',
      )
    })
    console.groupEnd()

    // ── STEP 2: fix texture color spaces + apply targeted overrides ─────────
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = true
      child.receiveShadow = true

      const mat = child.material as THREE.MeshStandardMaterial

      // Fix texture color spaces on original material before any override
      if (mat) {
        if (mat.map)          { mat.map.colorSpace = THREE.SRGBColorSpace;             mat.map.needsUpdate = true }
        if (mat.emissiveMap)  { mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;     mat.emissiveMap.needsUpdate = true }
        if (mat.envMap)       { mat.envMap.colorSpace = THREE.SRGBColorSpace;          mat.envMap.needsUpdate = true }
        if (mat.normalMap)    { mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace; mat.normalMap.needsUpdate = true }
        if (mat.roughnessMap) { mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace; mat.roughnessMap.needsUpdate = true }
        if (mat.metalnessMap) { mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace; mat.metalnessMap.needsUpdate = true }
        mat.needsUpdate = true
      }

      const n = child.name.toLowerCase()

      // FIX 5 — Police / chest text → subtle embossed dark
      if (
        n.includes('police') || n.includes('text') ||
        n.includes('logo')   || n.includes('chest_text') ||
        n.includes('label')  || n.includes('decal')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#0f0d1a'),
          metalness: 0.8,
          roughness: 0.4,
          envMapIntensity: 1.0,
        })
        return
      }

      // FIX 1a — Gun accent / barrel → glowing amber trim
      if (
        n.includes('barrel')      || n.includes('gun_accent') ||
        n.includes('weapon_trim') || n.includes('muzzle') ||
        n.includes('scope')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#EF9F27'),
          emissive: new THREE.Color('#EF9F27'),
          emissiveIntensity: 1.0,
          metalness: 0.3,
          roughness: 0.1,
        })
        return
      }

      // FIX 1b — Gun body → dark gunmetal
      if (
        n.includes('gun')    || n.includes('weapon') ||
        n.includes('rifle')  || n.includes('pistol') ||
        n.includes('cannon') || n.includes('shotgun')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#1a1a2e'),
          metalness: 0.9,
          roughness: 0.35,
          envMapIntensity: 0.5,
        })
        return
      }

      // FIX 2 — Yellow accent lights → bright gold emissive
      if (
        n.includes('yellow')        || n.includes('gold') ||
        n.includes('accent')        || n.includes('stripe') ||
        n.includes('trim')          || n.includes('band') ||
        n.includes('highlight')     || n.includes('led') ||
        n.includes('panel_light')   || n.includes('shoulder_light') ||
        n.includes('detail_light')  || n.includes('neon')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#FFD700'),
          emissive: new THREE.Color('#FFD700'),
          emissiveIntensity: 2.0,
          metalness: 0.0,
          roughness: 0.0,
          toneMapped: false,
        })
        return
      }

      // FIX 3 — Red dot / indicator → vivid glowing red
      if (
        n.includes('red')       || n.includes('dot') ||
        n.includes('indicator') || n.includes('alert') ||
        n.includes('warning')   || n.includes('signal')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#FF0000'),
          emissive: new THREE.Color('#FF2020'),
          emissiveIntensity: 1.5,
          metalness: 0.0,
          roughness: 0.0,
        })
        return
      }

      // FIX 4 — Eyes / visor → glowing amber emissive
      if (
        n.includes('eye')         || n.includes('lens') ||
        n.includes('visor')       || n.includes('screen') ||
        n.includes('glass')       || n.includes('glow') ||
        n.includes('lamp')        || n.includes('sensor') ||
        n.includes('camera')      || n.includes('optic') ||
        n.includes('face_light')  || n.includes('head_light') ||
        n.includes('retina')      || n.includes('pupil')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#FF6B00'),
          emissive: new THREE.Color('#FF4500'),
          emissiveIntensity: 2.0,
          metalness: 0.0,
          roughness: 0.0,
          toneMapped: false,
        })
        return
      }

      // STEP 4 fallback — color-based detection for generic mesh names (Mesh001, Object002, etc.)
      if (mat?.color) {
        const r = mat.color.r
        const g = mat.color.g
        const b = mat.color.b

        const isYellow    = r > 0.6 && g > 0.5 && b < 0.3
        const isOrangeRed = r > 0.7 && g < 0.4 && b < 0.2
        // Untextured grey mesh → darken to charcoal so body reads as dark premium black
        const isGrey      = !mat.map && Math.abs(r - g) < 0.15 && Math.abs(g - b) < 0.15 && r > 0.15

        if (isYellow) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFD700'),
            emissive: new THREE.Color('#FFD700'),
            emissiveIntensity: 2.0,
            metalness: 0.0,
            roughness: 0.0,
            toneMapped: false,
          })
        } else if (isOrangeRed) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FF4500'),
            emissive: new THREE.Color('#FF4500'),
            emissiveIntensity: 2.0,
            metalness: 0.0,
            roughness: 0.0,
            toneMapped: false,
          })
        } else if (isGrey) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#141420'),
            metalness: 0.75,
            roughness: 0.55,
          })
        }
      }

      // Default — floor roughness on original material to kill sharp specular hot spots
      if (mat && mat.roughness < 0.45) {
        mat.roughness = 0.45
        mat.needsUpdate = true
      }
    })

    // Log all node names to identify head bone
    console.group('=== ROBOT NODES ===')
    scene.traverse((child) => console.log(child.type, child.name))
    console.groupEnd()

    // Find head bone by common rig naming conventions
    scene.traverse((child) => {
      if (headBoneRef.current) return
      const n = child.name.toLowerCase()
      if (
        n === 'head' || n === 'mixamorighead' || n === 'bip_head' ||
        n === 'bip01_head' || n === 'head_jnt' || n.endsWith('_head') ||
        (n.includes('head') && !n.includes('headlight'))
      ) {
        headBoneRef.current = child
      }
    })
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return

    if (isTouchDevice) {
      groupRef.current.rotation.y += 0.004
    } else {
      // Body turns to follow mouse — ±40° horizontal, ±20° vertical
      groupRef.current.rotation.y +=
        (pointer.x * 0.7 - groupRef.current.rotation.y) * 0.06
      groupRef.current.rotation.x +=
        (-pointer.y * 0.35 - groupRef.current.rotation.x) * 0.06

      // Head adds extra rotation on top of body if bone is found
      if (headBoneRef.current) {
        headBoneRef.current.rotation.y +=
          (pointer.x * 0.5 - headBoneRef.current.rotation.y) * 0.08
        headBoneRef.current.rotation.x +=
          (-pointer.y * 0.3 - headBoneRef.current.rotation.x) * 0.08
      }
    }
    groupRef.current.position.y = -0.35
  })

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={[2, 2, 2]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(ROBOT_PATH)

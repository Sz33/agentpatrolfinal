'use client';

import React, {
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_DEPTH = 60;
const STREAK_DEPTH = TOTAL_DEPTH * 6;
const WRAP = 100;
const FRAGMENT_COUNT = 100;
const PARTICLE_COUNT = 600;
const LABEL_COUNT = 18;
const LERP = 0.05;

const LABEL_Z_NEAR = -25;
const LABEL_Z_FAR = -85;
const LABEL_WRAP = LABEL_Z_NEAR - LABEL_Z_FAR; // 60

type ProgressRef = RefObject<number>;
type MouseRef = RefObject<{ x: number; y: number }>;

const LABEL_POOL = [
  '// VECTOR SEAM',
  '// LLM VISIBILITY',
  '// AGENT TRACE',
  '// KERNEL HOOK',
  '// SYSCALL.READ',
  '// POLICY-001',
  '// MEM 0x7ffe',
  '// [PID 4812]',
  '// TLS HANDSHAKE',
  '// ANOMALY 0.03',
  '[-0.85, -0.83, 0.88]',
  '[ 0.42, -0.31, 0.67]',
  '[-0.13, -0.28, 0.07]',
  '{exec: deny}',
  '{policy: enforce}',
];

// fadeOut(p, start, end): 1 → 0 as p goes from start to end. Outside that
// range it returns 1 (before start) or 0 (after end).
function fadeOut(p: number, start: number, end: number) {
  if (p <= start) return 1;
  if (p >= end) return 0;
  return 1 - (p - start) / (end - start);
}
// Heading opacity / extendedProgress helpers were removed — the
// SecuringHeadingZone now drives its own opacity from its own scroll
// position so it doesn't have to import anything from this module.

// ── Wireframe fragments ──────────────────────────────────────────────────────

interface FragmentSeed {
  x: number;
  y: number;
  baseZ: number;
  rotAxis: THREE.Vector3;
  rotSpeed: number;
  scale: number;
  cardW: number;
  cardH: number;
  isAccent: boolean;
  isCard: boolean;
  driftSeed: number;
}

function Fragments({ progressRef }: { progressRef: ProgressRef }) {
  const seeds = useMemo<FragmentSeed[]>(() => {
    const out: FragmentSeed[] = [];
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      const isCard = Math.random() < 0.2;
      out.push({
        x: (Math.random() - 0.5) * 24,
        y: (Math.random() - 0.5) * 16,
        baseZ: -2 - Math.random() * 88,
        rotAxis: new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random(),
        )
          .subScalar(0.5)
          .normalize(),
        rotSpeed: 0.15 + Math.random() * 0.55,
        scale: 0.25 + Math.random() * 0.7,
        cardW: 0.5 + Math.random() * 0.7,
        cardH: 0.7 + Math.random() * 0.9,
        isAccent: Math.random() < 0.15,
        isCard,
        driftSeed: Math.random() * Math.PI * 2,
      });
    }
    return out;
  }, []);

  const cubeGrayIdx = useMemo(
    () => seeds.map((s, i) => (!s.isCard && !s.isAccent ? i : -1)).filter((v) => v >= 0),
    [seeds],
  );
  const cubeAccentIdx = useMemo(
    () => seeds.map((s, i) => (!s.isCard && s.isAccent ? i : -1)).filter((v) => v >= 0),
    [seeds],
  );
  const cardGrayIdx = useMemo(
    () => seeds.map((s, i) => (s.isCard && !s.isAccent ? i : -1)).filter((v) => v >= 0),
    [seeds],
  );
  const cardAccentIdx = useMemo(
    () => seeds.map((s, i) => (s.isCard && s.isAccent ? i : -1)).filter((v) => v >= 0),
    [seeds],
  );

  const cubeGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const cardGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  const grayMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#555555',
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const accentMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ef4444',
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const cubeGrayRef = useRef<THREE.InstancedMesh>(null);
  const cubeAccentRef = useRef<THREE.InstancedMesh>(null);
  const cardGrayRef = useRef<THREE.InstancedMesh>(null);
  const cardAccentRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const smoothProgress = useRef(0);

  useFrame(() => {
    smoothProgress.current +=
      (progressRef.current - smoothProgress.current) * LERP;
    // Constant camera speed — no deceleration.
    const zShift = smoothProgress.current * TOTAL_DEPTH;
    const t = performance.now() * 0.001;

    const fade = fadeOut(smoothProgress.current, 0.85, 0.95);
    grayMat.opacity = 0.7 * fade;
    accentMat.opacity = 0.85 * fade;
    grayMat.visible = accentMat.visible = fade > 0.001;

    const writeGroup = (
      mesh: THREE.InstancedMesh | null,
      idxList: number[],
      isCard: boolean,
    ) => {
      if (!mesh) return;
      idxList.forEach((seedIdx, instIdx) => {
        const s = seeds[seedIdx];
        const z = ((s.baseZ + zShift) % WRAP + WRAP) % WRAP - WRAP * 0.92;
        const driftX = Math.sin(t * 0.7 + s.driftSeed) * 0.4;
        const driftY = Math.cos(t * 0.55 + s.driftSeed) * 0.4;
        dummy.position.set(s.x + driftX, s.y + driftY, z);
        if (isCard) dummy.scale.set(s.cardW, s.cardH, 1);
        else dummy.scale.setScalar(s.scale);
        dummy.rotation.set(
          s.rotAxis.x * t * s.rotSpeed,
          s.rotAxis.y * t * s.rotSpeed,
          s.rotAxis.z * t * s.rotSpeed,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(instIdx, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    writeGroup(cubeGrayRef.current, cubeGrayIdx, false);
    writeGroup(cubeAccentRef.current, cubeAccentIdx, false);
    writeGroup(cardGrayRef.current, cardGrayIdx, true);
    writeGroup(cardAccentRef.current, cardAccentIdx, true);
  });

  return (
    <>
      {cubeGrayIdx.length > 0 && <instancedMesh ref={cubeGrayRef} args={[cubeGeo, grayMat, cubeGrayIdx.length]} />}
      {cubeAccentIdx.length > 0 && <instancedMesh ref={cubeAccentRef} args={[cubeGeo, accentMat, cubeAccentIdx.length]} />}
      {cardGrayIdx.length > 0 && <instancedMesh ref={cardGrayRef} args={[cardGeo, grayMat, cardGrayIdx.length]} />}
      {cardAccentIdx.length > 0 && <instancedMesh ref={cardAccentRef} args={[cardGeo, accentMat, cardAccentIdx.length]} />}
    </>
  );
}

// ── Particle field ───────────────────────────────────────────────────────────

function ParticleField({ progressRef }: { progressRef: ProgressRef }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = -2 - Math.random() * 88;
    }
    return arr;
  }, []);

  const baseZ = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) arr[i] = positions[i * 3 + 2];
    return arr;
  }, [positions]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#cccccc',
        size: 0.04,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      }),
    [],
  );

  const smoothProgress = useRef(0);

  useFrame(() => {
    smoothProgress.current +=
      (progressRef.current - smoothProgress.current) * LERP;
    const zShift = smoothProgress.current * TOTAL_DEPTH;
    const attr = geo.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = ((baseZ[i] + zShift) % WRAP + WRAP) % WRAP - WRAP * 0.92;
      attr.setZ(i, z);
    }
    attr.needsUpdate = true;

    const fade = fadeOut(smoothProgress.current, 0.85, 0.95);
    mat.opacity = 0.55 * fade;
    mat.visible = fade > 0.001;
  });

  return <points geometry={geo} material={mat} />;
}

// ── Light streaks ────────────────────────────────────────────────────────────

interface StreakSeed {
  x: number;
  y: number;
  baseZ: number;
  halfLength: number;
}

function makeStreakGroup(
  count: number,
  color: string,
  baseOpacity: number,
  parallel: number,
  lengthMin: number,
  lengthMax: number,
) {
  const seeds: StreakSeed[] = [];
  for (let i = 0; i < count; i++) {
    seeds.push({
      x: (Math.random() - 0.5) * 26,
      y: (Math.random() - 0.5) * 16,
      baseZ: -2 - Math.random() * 88,
      halfLength: lengthMin + Math.random() * (lengthMax - lengthMin),
    });
  }
  const totalSegs = count * parallel;
  const positions = new Float32Array(totalSegs * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: baseOpacity,
  });
  return { seeds, geometry, material, parallel, baseOpacity };
}

// Streaks are driven by streakProgress, which extends past the About section.
function LightStreaks({
  progressRef,
  streakProgressRef,
}: {
  progressRef: ProgressRef;
  streakProgressRef: ProgressRef;
}) {
  const whiteThin = useMemo(() => makeStreakGroup(30, '#ffffff', 0.5, 1, 1.5, 6.0), []);
  const whiteThick = useMemo(() => makeStreakGroup(6, '#ffffff', 0.5, 3, 4.0, 10.0), []);
  const redThin = useMemo(() => makeStreakGroup(8, '#ff6644', 0.4, 1, 1.5, 6.0), []);
  const redThick = useMemo(() => makeStreakGroup(2, '#ff6644', 0.4, 3, 5.0, 10.0), []);

  // Position math uses About-section progress for motion, so streaks travel
  // smoothly through the section. Opacity uses streakProgress (extended).
  const smoothPos = useRef(0);
  const smoothFade = useRef(0);

  useFrame(() => {
    smoothPos.current += (progressRef.current - smoothPos.current) * LERP;
    smoothFade.current += (streakProgressRef.current - smoothFade.current) * LERP;
    const zShift = smoothPos.current * STREAK_DEPTH;

    const fade = fadeOut(smoothFade.current, 0.7, 1.0);
    whiteThin.material.opacity = whiteThin.baseOpacity * fade;
    whiteThick.material.opacity = whiteThick.baseOpacity * fade;
    redThin.material.opacity = redThin.baseOpacity * fade;
    redThick.material.opacity = redThick.baseOpacity * fade;

    const writeGroup = (g: ReturnType<typeof makeStreakGroup>) => {
      const attr = g.geometry.getAttribute('position') as THREE.BufferAttribute;
      const { parallel } = g;
      g.seeds.forEach((s, i) => {
        const z = ((s.baseZ + zShift) % WRAP + WRAP) % WRAP - WRAP * 0.92;
        for (let p = 0; p < parallel; p++) {
          const xOff = parallel === 1 ? 0 : (p - (parallel - 1) / 2) * 0.04;
          const segIdx = i * parallel + p;
          attr.setXYZ(segIdx * 2, s.x + xOff, s.y, z - s.halfLength);
          attr.setXYZ(segIdx * 2 + 1, s.x + xOff, s.y, z + s.halfLength);
        }
      });
      attr.needsUpdate = true;
    };

    writeGroup(whiteThin);
    writeGroup(whiteThick);
    writeGroup(redThin);
    writeGroup(redThick);
  });

  return (
    <>
      <lineSegments geometry={whiteThin.geometry} material={whiteThin.material} />
      <lineSegments geometry={whiteThick.geometry} material={whiteThick.material} />
      <lineSegments geometry={redThin.geometry} material={redThin.material} />
      <lineSegments geometry={redThick.geometry} material={redThick.material} />
    </>
  );
}

// ── Floating text labels ─────────────────────────────────────────────────────

function makeTextSprite(
  text: string,
  accent: boolean,
): { sprite: THREE.Sprite; worldW: number; worldH: number } {
  const dpr = 2;
  const fontPx = 26;
  const padding = 12;
  const measure = document.createElement('canvas').getContext('2d')!;
  measure.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  const textWidth = measure.measureText(text).width;
  const w = Math.ceil(textWidth + padding * 2);
  const h = fontPx + padding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.45)';
  ctx.fillText(text, w / 2, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });

  const sprite = new THREE.Sprite(mat);
  const worldH = 0.35;
  const worldW = (w / h) * worldH;
  sprite.scale.set(worldW, worldH, 1);
  return { sprite, worldW, worldH };
}

interface LabelSeed {
  text: string;
  x: number;
  y: number;
  baseOffset: number;
  driftSeed: number;
  isAccent: boolean;
  baseOpacity: number;
}

function TextLabels({ progressRef }: { progressRef: ProgressRef }) {
  const seeds = useMemo<LabelSeed[]>(() => {
    const out: LabelSeed[] = [];
    for (let i = 0; i < LABEL_COUNT; i++) {
      let x = 0;
      let y = 0;
      for (let attempt = 0; attempt < 20; attempt++) {
        x = (Math.random() - 0.5) * 22;
        y = (Math.random() - 0.5) * 14;
        if (Math.abs(x) >= 4 || Math.abs(y) >= 2.5) break;
      }
      const isAccent = Math.random() < 0.2;
      out.push({
        text: LABEL_POOL[Math.floor(Math.random() * LABEL_POOL.length)],
        x,
        y,
        baseOffset: Math.random() * LABEL_WRAP,
        driftSeed: Math.random() * Math.PI * 2,
        isAccent,
        baseOpacity: isAccent ? 0.55 : 0.4,
      });
    }
    return out;
  }, []);

  const [bundles, setBundles] = useState<
    { sprite: THREE.Sprite; worldW: number; worldH: number }[]
  >([]);

  useEffect(() => {
    const created = seeds.map((s) => makeTextSprite(s.text, s.isAccent));
    setBundles(created);
    return () => {
      created.forEach(({ sprite }) => {
        const m = sprite.material as THREE.SpriteMaterial;
        m.map?.dispose();
        m.dispose();
      });
    };
  }, [seeds]);

  const smoothProgress = useRef(0);

  useFrame(() => {
    smoothProgress.current +=
      (progressRef.current - smoothProgress.current) * LERP;
    const zShift = smoothProgress.current * TOTAL_DEPTH;
    const t = performance.now() * 0.001;
    const exitFade = fadeOut(smoothProgress.current, 0.85, 0.95);

    bundles.forEach(({ sprite, worldW, worldH }, i) => {
      const s = seeds[i];
      const offset =
        ((s.baseOffset + zShift) % LABEL_WRAP + LABEL_WRAP) % LABEL_WRAP;
      const z = LABEL_Z_FAR + offset;
      const driftX = Math.sin(t * 0.4 + s.driftSeed) * 0.25;
      const driftY = Math.cos(t * 0.3 + s.driftSeed) * 0.25;
      sprite.position.set(s.x + driftX, s.y + driftY, z);

      const mat = sprite.material as THREE.SpriteMaterial;
      let safety = 1;
      if (z > -10) safety = Math.max(0, (-z) / 10);
      const dist = -z;
      const span = (dist - 55) / 30;
      const fall = 1 - 0.4 * span * span;
      mat.opacity = s.baseOpacity * safety * fall * exitFade;

      const sizeFactor = Math.min(1, dist / 30);
      sprite.scale.set(worldW * sizeFactor, worldH * sizeFactor, 1);
    });
  });

  return (
    <group>
      {bundles.map(({ sprite }, i) => (
        <primitive key={i} object={sprite} />
      ))}
    </group>
  );
}

// ── Mouse parallax camera tilt ───────────────────────────────────────────────

function CameraTilt({ mouseRef }: { mouseRef: MouseRef }) {
  useFrame(({ camera }) => {
    const targetRotX = mouseRef.current.y * 0.05;
    const targetRotY = mouseRef.current.x * 0.05;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotY - camera.rotation.y) * 0.05;
  });
  return null;
}

// ── Stages + overlay ─────────────────────────────────────────────────────────

interface Stage {
  num: string;
  pillLabel: string;
  heading: string;
  desc: string;
  isIntro?: boolean;
  /** Intro-only label rendered in `// LABEL` form instead of the pill. */
  label?: string;
}

const STAGES: Stage[] = [
  {
    num: '00',
    pillLabel: 'INTRO',
    label: 'INTRODUCING AGENTPATROL',
    heading: 'The security layer your AI agents have been missing.',
    desc: '',
    isIntro: true,
  },
  {
    num: '01',
    pillLabel: 'KERNEL',
    heading: 'RUNTIME ENFORCEMENT',
    desc: 'seccomp-bpf and Tetragon eBPF block threats before the syscall completes. Not after. Before.',
  },
  {
    num: '02',
    pillLabel: 'INTERCEPT',
    heading: 'LLM PROXY VISIBILITY',
    desc: "Every prompt, tool call, and response captured. Your agent thinks it's talking to an external LLM. It's actually talking to AgentPatrol first.",
  },
  {
    num: '03',
    pillLabel: 'CORRELATE',
    heading: 'AI DETECTION ENGINE',
    desc: 'LLM triages every event in real time. LLM analyzes high-risk chains. Two streams, one verdict.',
  },
  {
    num: '04',
    pillLabel: 'INTEGRATE',
    heading: 'ZERO CODE CHANGE',
    desc: 'Wraps any LangChain, LangGraph, or CrewAI agent with one command. No SDK. No framework hooks.',
  },
];

// Uneven bands now — Stage 0 (intro) gets a wider 0.30 band so the big
// hero headline can fade in slowly, hold long, and fade out smoothly.
// Stages 1-3 each occupy a narrower 0.1625 band. Stage 4 keeps its
// custom fade-in/hold/fade-out timing for the SecuringHeadingZone
// handoff and chrome/atmosphere fade-out compatibility.
//
//   Stage 0 INTRO     0.0000 → 0.3000   (fade-out extends to 0.32 for crossfade)
//   Stage 1 KERNEL    0.3000 → 0.4625
//   Stage 2 INTERCEPT 0.4625 → 0.6250
//   Stage 3 CORRELATE 0.6250 → 0.7875
//   Stage 4 INTEGRATE 0.7875 → 0.9500
//
// Stage 0's fade-out (ending 0.32) overlaps with Stage 1's fade-in
// (starting 0.30) so the handoff crossfades instead of cutting hard.

const STAGE_STARTS = [0, 0.30, 0.4625, 0.625, 0.7875];
const STAGE_ENDS = [0.30, 0.4625, 0.625, 0.7875, 0.95];

function stageVisual(progress: number, stageIdx: number) {
  if (stageIdx === 0) {
    // Intro — wider band (0.30) with bespoke timing per spec.
    //   fade in  0.00 → 0.08   (slow, gentle materialize)
    //   hold     0.08 → 0.20   (long read window)
    //   fade out 0.20 → 0.32   (extends 0.02 past band end → crossfade)
    if (progress <= 0) return { opacity: 0, shiftY: 0 };
    if (progress < 0.08) return { opacity: progress / 0.08, shiftY: 0 };
    if (progress < 0.20) return { opacity: 1, shiftY: 0 };
    if (progress < 0.32) {
      const t = (progress - 0.20) / 0.12;
      return { opacity: 1 - t, shiftY: -t * 16 };
    }
    return { opacity: 0, shiftY: -16 };
  }
  if (stageIdx === 4) {
    // INTEGRATE — band 0.7875 → 0.95. Fade-in widened to fill the band
    // start; hold/fade-out windows preserved verbatim for chrome and
    // SecuringHeadingZone compatibility.
    //   fade in  0.7875 → 0.85
    //   hold     0.85   → 0.88
    //   fade out 0.88   → 0.95
    if (progress < 0.7875) return { opacity: 0, shiftY: 0 };
    if (progress < 0.85) return { opacity: (progress - 0.7875) / 0.0625, shiftY: 0 };
    if (progress < 0.88) return { opacity: 1, shiftY: 0 };
    if (progress < 0.95) {
      const t = (progress - 0.88) / 0.07;
      return { opacity: 1 - t, shiftY: -t * 16 };
    }
    return { opacity: 0, shiftY: -16 };
  }
  // Stages 1-3 — narrow 0.1625 bands with proportional 10% / 80% / 10%
  // fade-in / hold / fade-out (same proportions as the old 0.20 design).
  const start = STAGE_STARTS[stageIdx];
  const width = STAGE_ENDS[stageIdx] - start; // = 0.1625
  const local = (progress - start) / width;
  if (local < 0 || local > 1) return { opacity: 0, shiftY: 0 };
  if (local < 0.1) return { opacity: local / 0.1, shiftY: 0 };
  if (local < 0.9) return { opacity: 1, shiftY: 0 };
  const t = (local - 0.9) / 0.1;
  return { opacity: 1 - t, shiftY: -t * 16 };
}

const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

interface OverlayProps {
  progress: number;
}

function StageOverlay({ progress }: OverlayProps) {
  const fmt = (n: number) => n.toFixed(2);
  const coords = `[${fmt(progress * -1.0 + 0.25)}, ${fmt(
    progress * -0.6 - 0.05,
  )}, ${fmt(progress * 1.5 - 0.5)}]`;
  const chromeOpacity = fadeOut(progress, 0.85, 0.92);
  const atmosOpacity = fadeOut(progress, 0.85, 0.95);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 100%)',
          opacity: atmosOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, rgba(239,68,68,0.04) 0%, transparent 40%)',
          opacity: atmosOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: GRAIN_URL,
          backgroundSize: '200px 200px',
          opacity: 0.06 * atmosOpacity,
          mixBlendMode: 'overlay',
          animation: 'about-grain-shift 0.4s steps(5) infinite',
        }}
      />

      {/* Stage cards (centered viewport position) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          color: 'white',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      >
        {STAGES.map((s, i) => {
          const { opacity: o, shiftY } = stageVisual(progress, i);
          if (o <= 0.001) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, calc(-50% + ${shiftY}px))`,
                opacity: o,
                transition: 'opacity 0.18s linear, transform 0.18s linear',
                maxWidth: s.isIntro ? '900px' : '720px',
                width: 'calc(100% - 48px)',
                textAlign: 'center',
              }}
            >
              {s.isIntro ? (
                <>
                  {/* Intro stage — small red label + big hero headline */}
                  <p
                    style={{
                      color: '#ef4444',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: 12,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      margin: '0 0 24px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 10px #ef4444',
                      }}
                    />
                    // {s.label}
                  </p>
                  <h2
                    style={{
                      color: 'white',
                      fontFamily: 'var(--font-heading), sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(40px, 6vw, 80px)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.1,
                      margin: 0,
                      textShadow: '0 2px 24px rgba(0,0,0,0.85)',
                    }}
                  >
                    {s.heading}
                  </h2>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '0.5px solid #ef4444',
                      borderRadius: 2,
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      marginBottom: 22,
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ background: 'rgba(239,68,68,0.25)', color: 'white', padding: '6px 10px' }}>{s.num}</span>
                    <span style={{ color: 'rgba(239,68,68,0.55)', padding: '6px 8px' }}>│</span>
                    <span style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', padding: '6px 12px' }}>{s.pillLabel}</span>
                    <span style={{ color: 'rgba(239,68,68,0.45)', padding: '6px 10px' }}>||</span>
                  </div>
                  <h2
                    style={{
                      color: 'white',
                      fontWeight: 500,
                      fontSize: 'clamp(36px, 5.2vw, 56px)',
                      letterSpacing: '-0.005em',
                      lineHeight: 1.05,
                      margin: '0 0 22px',
                      textShadow: '0 0 30px rgba(239,68,68,0.3), 0 2px 20px rgba(0,0,0,0.85)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.heading}
                  </h2>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 'clamp(12px, 1vw, 14px)',
                      lineHeight: 1.65,
                      maxWidth: 520,
                      margin: '0 auto',
                      textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                    }}
                  >
                    {s.desc}
                  </p>
                </>
              )}
            </div>
          );
        })}

        {/* Heading rendering moved out — single element lives in
            StackingSteps and pulls itself to viewport centre via transform. */}

        {/* Corner labels */}
        <div style={{ position: 'absolute', top: 24, left: 28, fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', opacity: chromeOpacity }}>
          AGENTPATROL
        </div>
        <div style={{ position: 'absolute', top: 24, right: 28, fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', opacity: chromeOpacity }}>
          // ABOUT
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 28, fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', opacity: chromeOpacity }}>
          // VECTOR SEAM
        </div>
        <div style={{ position: 'absolute', bottom: 24, right: 28, fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums', opacity: chromeOpacity }}>
          {coords}
        </div>

        {/* Right-edge progress dots (only first 4 stages) */}
        <div
          style={{
            position: 'absolute',
            right: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            opacity: chromeOpacity,
          }}
        >
          {STAGES.map((_, i) => {
            // Active while user is inside this stage's band (uneven widths).
            const active = progress >= STAGE_STARTS[i] && progress < STAGE_ENDS[i];
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: active ? '#ef4444' : 'rgba(255,255,255,0.2)',
                    boxShadow: active ? '0 0 10px #ef4444' : 'none',
                    animation: active ? 'about-dot-pulse 1.6s ease-in-out infinite' : 'none',
                  }}
                />
                {i < STAGES.length - 1 && (
                  <span
                    style={{
                      width: 1,
                      height: 18,
                      // Connector lights up once user has scrolled past this stage's end.
                      background: progress > STAGE_ENDS[i] ? '#ef4444' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.2s linear',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Reduced-motion fallback ──────────────────────────────────────────────────

function ReducedMotionFallback() {
  return (
    <section
      id="about"
      style={{
        background: '#000',
        color: 'white',
        padding: '120px 24px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.3em', margin: '0 0 16px' }}>
          ABOUT
        </p>
        <h2
          style={{
            color: 'white',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-0.005em',
            lineHeight: 1.05,
            margin: '0 0 64px',
            textTransform: 'uppercase',
          }}
        >
          What is AgentPatrol?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {STAGES.map((s) => (
            <div key={s.num} style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 24 }}>
              <div style={{ color: '#ef4444', fontSize: 11, letterSpacing: '0.25em', marginBottom: 12 }}>
                {s.num} · {s.pillLabel}
              </div>
              <h3 style={{ color: 'white', fontSize: 18, letterSpacing: '0.05em', margin: '0 0 12px' }}>{s.heading}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AboutFlythrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const streakProgressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const aboutScrollable = rect.height - vh;
      if (aboutScrollable <= 0) return;
      const scrolled = -rect.top;

      // Standard progress 0..1 across About section (clamped).
      const p = Math.max(0, Math.min(1, scrolled / aboutScrollable));
      // Extended progress that goes past 1 into the next section.
      const ep = Math.max(0, scrolled / aboutScrollable);
      // Streak progress: 0 at About start, 1 at ~50% into next section.
      // streakRange = aboutScrollable + 1.5 viewports ≈ 50% into a typical
      // following section.
      const streakRange = aboutScrollable + 1.5 * vh;
      const sp = Math.max(0, Math.min(1, scrolled / streakRange));

      progressRef.current = p;
      streakProgressRef.current = sp;
      setProgress(p);

      // Active when within range that needs the canvas mounted. Kept
      // ~1.10 of extendedProgress as a safety margin past the section
      // end so the streaks have room to fade out before unmounting.
      const isActive = scrolled > -vh && ep < 1.10;
      setActive(isActive);
    };
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  if (reduced) return <ReducedMotionFallback />;

  return (
    <>
      {/* Scroll runway — 750vh to give Stage 0's wider 0.30 band proper
          read time. Canvas is fixed-positioned (below) so it persists
          across the section boundary. */}
      <section
        ref={sectionRef}
        id="about"
        style={{
          height: '750vh',
          position: 'relative',
          background: '#000',
        }}
      />

      {/* Fixed canvas + atmospheric overlay — persists across the page during
          About scroll + a buffer past the section end. */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          display: active ? 'block' : 'none',
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
@keyframes about-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.4); opacity: 0.5; }
}
@keyframes about-grain-shift {
  0%   { background-position: 0 0; }
  20%  { background-position: 1px -1px; }
  40%  { background-position: -2px 1px; }
  60%  { background-position: 2px 2px; }
  80%  { background-position: -1px -2px; }
  100% { background-position: 0 0; }
}`,
          }}
        />

        <Canvas
          camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 200 }}
          gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <fog attach="fog" args={['#000000', 6, 60]} />
          <Fragments progressRef={progressRef} />
          <ParticleField progressRef={progressRef} />
          <LightStreaks progressRef={progressRef} streakProgressRef={streakProgressRef} />
          <TextLabels progressRef={progressRef} />
          <CameraTilt mouseRef={mouseRef} />
        </Canvas>

        <StageOverlay progress={progress} />
      </div>
    </>
  );
}

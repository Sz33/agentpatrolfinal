'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Robot } from './Robot'
import { EyeTracker } from './EyeTracker'

export function SceneWithTracker() {
  return (
    <Canvas
      camera={{ position: [0, 2, 4], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene, camera }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.55
        camera.lookAt(0, 1, 0)
      }}
      shadows
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
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
  )
}

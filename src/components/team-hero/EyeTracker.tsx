'use client'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

declare global {
  interface Window {
    __robotEyes?: {
      left:  { fx: number; fy: number }
      right: { fx: number; fy: number }
    }
  }
}

export function EyeTracker() {
  const { scene, camera } = useThree()
  const eyeL = useRef<THREE.Object3D | null>(null)
  const eyeR = useRef<THREE.Object3D | null>(null)
  const v    = useRef(new THREE.Vector3())

  useFrame(() => {
    // Keep searching until both eyes are found (GLB may not be loaded on first frame)
    if (!eyeL.current || !eyeR.current) {
      const hits: { obj: THREE.Object3D; wx: number }[] = []

      scene.traverse((child) => {
        const n = child.name.toLowerCase()
        const byName =
          n.includes('eye') || n.includes('lens')  || n.includes('visor')  ||
          n.includes('pupil') || n.includes('retina') || n.includes('optic') ||
          n.includes('face_light') || n.includes('head_light')

        if (byName) {
          child.getWorldPosition(v.current)
          hits.push({ obj: child, wx: v.current.x })
          return
        }

        // Fallback: emissive red/orange material (how Robot.tsx colours the eyes)
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat?.emissive) {
            const { r, g, b } = mat.emissive
            if (r > 0.5 && g < 0.35 && b < 0.25) {
              child.getWorldPosition(v.current)
              hits.push({ obj: child, wx: v.current.x })
            }
          }
        }
      })

      if (hits.length >= 2) {
        hits.sort((a, b) => a.wx - b.wx)
        eyeL.current = hits[0].obj
        eyeR.current = hits[hits.length - 1].obj
      } else if (hits.length === 1) {
        eyeL.current = hits[0].obj
        eyeR.current = hits[0].obj
      }
    }

    if (!eyeL.current || !eyeR.current) return

    const project = (obj: THREE.Object3D) => {
      obj.getWorldPosition(v.current)
      v.current.project(camera)
      return {
        fx: (v.current.x + 1) / 2,        // 0 = canvas left,  1 = canvas right
        fy: (1 - v.current.y) / 2,        // 0 = canvas top,   1 = canvas bottom
      }
    }

    window.__robotEyes = {
      left:  project(eyeL.current),
      right: project(eyeR.current),
    }
  })

  return null
}

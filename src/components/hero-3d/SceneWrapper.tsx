'use client'
import dynamic from 'next/dynamic'

const SceneNoSSR = dynamic(
  () => import('./SceneWithTracker').then((m) => ({ default: m.SceneWithTracker })),
  { ssr: false, loading: () => null }
)

export function SceneWrapper() {
  return <SceneNoSSR />
}

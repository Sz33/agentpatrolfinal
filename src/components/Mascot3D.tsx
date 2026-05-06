'use client';
import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Stage, Html } from '@react-three/drei';
import * as THREE from 'three';

const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

function MascotModel() {
  const { scene } = useGLTF('/mascot.glb');
  return <primitive object={scene} scale={2.2} rotation={[0, -0.5, 0]} position={[0, -2.5, 0]} />;
}

function CameraRig({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
  const { camera } = useThree();
  const baseX = -1.5;
  const baseY = 2.6;
  const baseZ = 5.5;

  // Targets at scroll = 1
  const targetY = baseY + 1.0;   // camera rises slightly
  const targetZ = 3.2;             // camera zooms closer (from 5.5 to 3.2)

  useFrame(() => {
    mouse.x += (targetMouse.x - mouse.x) * 0.06;
    mouse.y += (targetMouse.y - mouse.y) * 0.06;

    const sp = scrollProgressRef.current ?? 0;

    const desiredX = baseX + mouse.x * 0.5;
    const desiredY = (baseY + (targetY - baseY) * sp) - mouse.y * 0.3;
    const desiredZ = baseZ + (targetZ - baseZ) * sp;

    camera.position.x += (desiredX - camera.position.x) * 0.06;
    camera.position.y += (desiredY - camera.position.y) * 0.06;
    camera.position.z += (desiredZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Mascot3D() {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      scrollProgressRef.current = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ width: '100%', height: '900px', marginTop: '-40px' }}>
      <Canvas camera={{ position: [-1.5, 2.6, 5.5], fov: 38 }}>
        <Suspense fallback={
          <Html center>
            <div style={{
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.15em',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}>
              INITIALIZING AGENT...
            </div>
          </Html>
        }>
          <Stage environment="city" intensity={0.5}>
            <MascotModel />
          </Stage>
          <CameraRig scrollProgressRef={scrollProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

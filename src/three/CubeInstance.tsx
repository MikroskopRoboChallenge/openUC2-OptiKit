import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { moduleWorldPosition } from './coords';
import type { PlacedModule, ModuleDefinition } from '../types';

// ─── Fallback ────────────────────────────────────────────────────────────────

function FallbackBox({ offset }: { offset?: [number, number, number] }) {
  return (
    <group position={offset}>
      <mesh>
        <boxGeometry args={[50, 50, 50]} />
        <meshBasicMaterial color={0x888888} wireframe />
      </mesh>
    </group>
  );
}

// ─── GLB loader ──────────────────────────────────────────────────────────────
// Separate component so useGLTF is always called with a real URL (no conditional
// hook calls). Suspends while loading; error boundary above catches failures.

interface GLBSceneProps {
  url: string;
  offset?: [number, number, number];
}

function GLBScene({ url, offset }: GLBSceneProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(
    () => skeletonClone(scene) as THREE.Group,
    [scene],
  );
  return (
    <group position={offset}>
      <primitive object={cloned} />
    </group>
  );
}

// ─── CubeInstance ────────────────────────────────────────────────────────────

interface CubeInstanceProps {
  module: PlacedModule;
  moduleDef?: ModuleDefinition;
}

export function CubeInstance({ module: m, moduleDef: def }: CubeInstanceProps) {
  const worldPos  = moduleWorldPosition(m);
  const yRotRad   = THREE.MathUtils.degToRad(-m.rotation);
  const topRotRad = THREE.MathUtils.degToRad(m.topRotation ?? 0);
  const offset    = def?.glbOffset;

  return (
    // Outer group: grid position + in-plane (Y-axis) rotation
    <group position={worldPos} rotation={[0, yRotRad, 0]}>
      {/* Inner group: top rotation around Z axis */}
      <group rotation={[0, 0, topRotRad]}>
        {def?.glbUrl ? (
          <Suspense fallback={<FallbackBox offset={offset} />}>
            <GLBScene url={def.glbUrl} offset={offset} />
          </Suspense>
        ) : (
          <FallbackBox offset={offset} />
        )}
      </group>
    </group>
  );
}

import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { ModuleDefinition } from '../types';

/** Wireframe box used as a fallback when no GLB is available. */
function makeFallbackScene(): THREE.Group {
  const geometry = new THREE.BoxGeometry(50, 50, 50);
  const material = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

export interface UseModuleGLBResult {
  scene: THREE.Group;
  isPending: boolean;
}

/**
 * Load and clone the GLB scene for a given ModuleDefinition.
 * - When glbUrl is present: loads via useGLTF and returns a deep clone so
 *   each placed module has independent transforms.
 * - When glbUrl is absent or the load fails: returns a 50×50×50 wireframe box.
 * Never throws — errors are caught and replaced with the fallback.
 */
export function useModuleGLB(def: ModuleDefinition): UseModuleGLBResult {
  const url = def.glbUrl;

  // We must call useGLTF unconditionally (rules of hooks).
  // When there is no URL we pass a sentinel that will be caught by the error
  // boundary below and handled via the fallback ref.
  const safeUrl = url ?? '';

  const fallbackRef = useRef<THREE.Group>(makeFallbackScene());

  // When no URL is provided skip loading entirely.
  if (!safeUrl) {
    return { scene: fallbackRef.current, isPending: false };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  try {
    // useGLTF suspends until the asset is ready; catch any synchronous issues.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const gltf = useGLTF(safeUrl);
    const cloned = skeletonClone(gltf.scene) as THREE.Group;
    return { scene: cloned, isPending: false };
  } catch (err) {
    // If loading threw (e.g. 404), return the fallback.
    if (err instanceof Promise) {
      // Suspense signal — re-throw so React can suspend.
      throw err;
    }
    console.warn(`useModuleGLB: failed to load "${safeUrl}"`, err);
    return { scene: fallbackRef.current, isPending: false };
  }
}

/**
 * Preload a module's GLB asset so it's in the cache before the 3D view mounts.
 * Safe to call for modules without a glbUrl (no-op).
 */
export function preloadModuleGLB(def: ModuleDefinition): void {
  if (def.glbUrl) {
    useGLTF.preload(def.glbUrl);
  }
}

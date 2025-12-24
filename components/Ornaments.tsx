
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORNAMENT_COUNT, TREE_HEIGHT, TREE_RADIUS, CHAOS_RADIUS, COLORS } from '../constants';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progress: number;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progress }) => {
  const ballRef = useRef<THREE.InstancedMesh>(null);
  const giftRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.InstancedMesh>(null);

  const { data, counts } = useMemo(() => {
    const list: OrnamentData[] = [];
    const counts = { BALL: 0, GIFT: 0, LIGHT: 0 };

    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      const typeRand = Math.random();
      const type = typeRand > 0.6 ? 'BALL' : (typeRand > 0.2 ? 'LIGHT' : 'GIFT');
      counts[type]++;
      
      // Chaos position
      const r_c = Math.pow(Math.random(), 1/3) * CHAOS_RADIUS;
      const theta_c = Math.random() * Math.PI * 2;
      const phi_c = Math.acos(2 * Math.random() - 1);
      const chaosPosition: [number, number, number] = [
        r_c * Math.sin(phi_c) * Math.cos(theta_c),
        r_c * Math.sin(phi_c) * Math.sin(theta_c),
        r_c * Math.cos(phi_c)
      ];

      // Target position on tree surface
      const h = Math.random() * TREE_HEIGHT;
      const r_t = (1 - h / TREE_HEIGHT) * TREE_RADIUS;
      const theta_t = Math.random() * Math.PI * 2;
      const targetPosition: [number, number, number] = [
        r_t * Math.cos(theta_t),
        h - (TREE_HEIGHT / 2),
        r_t * Math.sin(theta_t)
      ];

      // Physical traits
      let weight = 0.05;
      let scale = 0.2;
      let color = COLORS.GOLD_METALLIC;

      if (type === 'BALL') {
        weight = 0.04;
        scale = 0.25 + Math.random() * 0.15;
        color = i % 3 === 0 ? COLORS.GOLD_BRIGHT : (i % 3 === 1 ? COLORS.RED_LUXURY : COLORS.EMERALD_LIGHT);
      } else if (type === 'GIFT') {
        weight = 0.02;
        scale = 0.4 + Math.random() * 0.2;
        color = i % 2 === 0 ? COLORS.GOLD_DEEP : COLORS.EMERALD_DARK;
      } else if (type === 'LIGHT') {
        weight = 0.08;
        scale = 0.1;
        // Changed from WHITE_SOFT to GOLD_BRIGHT
        color = COLORS.GOLD_BRIGHT;
      }

      list.push({ chaosPosition, targetPosition, scale, type, weight, color });
    }
    return { data: list, counts };
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const progressState = useRef<Map<number, number>>(new Map());

  useFrame((state) => {
    const refs = [ballRef, giftRef, lightRef];
    const types = ['BALL', 'GIFT', 'LIGHT'] as const;
    
    refs.forEach((ref, idx) => {
      if (!ref.current) return;
      const currentType = types[idx];
      let instanceIdx = 0;

      data.forEach((orn, ornIdx) => {
        if (orn.type !== currentType) return;

        const currentP = progressState.current.get(ornIdx) || 0;
        const newP = THREE.MathUtils.lerp(currentP, progress, orn.weight);
        progressState.current.set(ornIdx, newP);

        const x = THREE.MathUtils.lerp(orn.chaosPosition[0], orn.targetPosition[0], newP);
        const y = THREE.MathUtils.lerp(orn.chaosPosition[1], orn.targetPosition[1], newP);
        const z = THREE.MathUtils.lerp(orn.chaosPosition[2], orn.targetPosition[2], newP);

        tempObj.position.set(x, y, z);
        tempObj.scale.setScalar(orn.scale * (0.8 + 0.2 * Math.sin(state.clock.elapsedTime * 2 + ornIdx)));
        
        tempObj.rotation.y = state.clock.elapsedTime * (orn.weight * 5);
        tempObj.updateMatrix();
        
        ref.current!.setMatrixAt(instanceIdx, tempObj.matrix);
        tempColor.set(orn.color);
        
        if (orn.type === 'LIGHT') {
          // Sharp flickering alternating logic using staggered sine wave
          const flickerPhase = state.clock.elapsedTime * 5 + (ornIdx * 0.5);
          const flicker = Math.sin(flickerPhase) > 0 ? 1.0 : 0.1;
          const intensity = 1 + newP * 15 * flicker;
          tempColor.multiplyScalar(intensity);
        }
        ref.current!.setColorAt(instanceIdx, tempColor);
        
        instanceIdx++;
      });
      ref.current!.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    });
  });

  return (
    <>
      <instancedMesh ref={ballRef} args={[undefined, undefined, counts.BALL]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>
      
      <instancedMesh ref={giftRef} args={[undefined, undefined, counts.GIFT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.5} roughness={0.5} />
      </instancedMesh>

      <instancedMesh ref={lightRef} args={[undefined, undefined, counts.LIGHT]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial emissive={COLORS.GOLD_BRIGHT} emissiveIntensity={2} />
      </instancedMesh>
    </>
  );
};

export default Ornaments;

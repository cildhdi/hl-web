import { Spin } from 'antd';
import { useEffect } from 'react';
import * as THREE from 'three';

import { LoadingOutlined } from '@ant-design/icons';
import { a, useSprings } from '@react-spring/three';
import { Canvas } from '@react-three/fiber';

const number = 35;
const colors = [
  '#A2CCB6',
  '#FCEEB5',
  '#EE786E',
  '#e0feff',
  'lightpink',
  'lightblue',
];
const random = (i: number) => {
  const r = Math.random();
  return {
    position: [100 - Math.random() * 200, 100 - Math.random() * 200, i * 1.5],
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    scale: [1 + r * 14, 1 + r * 14, 1],
    rotation: [0, 0, THREE.MathUtils.degToRad(Math.round(Math.random()) * 45)],
  };
};

const data = new Array(number).fill(undefined).map(() => {
  return {
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    args: [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10],
  };
});

function Content() {
  const [springs, set] = useSprings(number, (i) => ({
    from: random(i),
    ...random(i),
    config: { mass: 20, tension: 150, friction: 50 },
  }));
  useEffect(
    () =>
      void setInterval(
        () => set((i) => ({ ...random(i), delay: i * 40 })),
        3000
      ),
    []
  );
  return (
    <>
      {data.map((d, index) => (
        <a.mesh
          key={index}
          {...(springs[index] as any)}
          castShadow
          receiveShadow
        >
          <boxBufferGeometry attach="geometry" args={d.args as any} />
          <a.meshStandardMaterial
            attach="material"
            color={springs[index].color}
            roughness={0.75}
            metalness={0.5}
          />
        </a.mesh>
      ))}
    </>
  );
}

function Lights() {
  return (
    <group>
      <pointLight intensity={0.3} />
      <ambientLight intensity={2} />
      <spotLight
        castShadow
        intensity={0.2}
        angle={Math.PI / 7}
        position={[150, 150, 250]}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
}

export const WaitForConnection = () => {
  return (
    <div className="relative h-full">
      <Canvas linear shadows camera={{ position: [0, 0, 100], fov: 100 }}>
        <Lights />
        <Content />
      </Canvas>
      <div className="absolute flex items-center justify-center top-0 left-0 bottom-0 right-0">
        <Spin tip="等待设备连接..." size="large" />
      </div>
    </div>
  );
};

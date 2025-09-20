import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GLBModel from './GLBModel';

const ThreeDBox = ({
  width = 350,
  height = 350,
  modelScale = 1,
  camera = { position: [0, 0, -3.5], fov: 45 } // ✅ fixed here
}) => {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Canvas
        camera={camera}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        {/* Balanced lighting */}
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={1} />

        {/* Model */}
        <group position={[0, 0, 0]}>
          <GLBModel scale={modelScale} />
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.75}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDBox;

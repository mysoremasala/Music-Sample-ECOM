import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

// Simple GLB model wrapper that loads and renders the model from public/models/sample.glb
// Uses drei's useGLTF for caching and performance.
const GLBModel = (props) => {
  const gltf = useGLTF('/models/sample.glb');

  // Ensure the model is frustum-cull friendly and cast/receive shadows if needed
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf.scene]);

  return (
    <primitive object={scene} {...props} />
  );
};

useGLTF.preload('/models/sample.glb');

export default GLBModel;



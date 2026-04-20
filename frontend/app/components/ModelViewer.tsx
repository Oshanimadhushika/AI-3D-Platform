"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Center } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ModelViewerProps {
  glbUrl: string;
}

export default function ModelViewer({ glbUrl }: ModelViewerProps) {
  return (
    <div className="w-full h-[400px] bg-black/40 rounded-3xl overflow-hidden border border-white/5 shadow-inner relative">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 text-indigo-400">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm font-medium animate-pulse">Loading 3D Model...</p>
          </div>
        </div>
      }>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
          
          <Center top>
            <Model url={glbUrl} />
          </Center>

          <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.25} far={10} color="#000000" />
          
          <Environment preset="city" />
          
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.75} 
            enableZoom={true} 
            enablePan={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

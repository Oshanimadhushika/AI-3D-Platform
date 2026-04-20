import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Center, Html, Stage } from "@react-three/drei";
import { Loader2 } from "lucide-react";

function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl scale-75 md:scale-100">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 whitespace-nowrap">
          Loading 3D Data
        </p>
      </div>
    </Html>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Apply standard material polish if needed
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

interface ModelViewerProps {
  glbUrl: string;
}

export default function ModelViewer({ glbUrl }: ModelViewerProps) {
  return (
    <div className="w-full h-[450px] bg-gradient-to-b from-black/60 to-black/30 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.1),transparent_70%)]" />
      
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Suspense fallback={<CanvasLoader />}>
          <Stage 
            environment="city" 
            intensity={0.5} 
            contactShadow={{ opacity: 0.4, blur: 2 }} 
            adjustCamera={true}
            shadows="contact"
          >
            <Model url={glbUrl} />
          </Stage>
        </Suspense>

        <OrbitControls 
          makeDefault 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5} 
          enableZoom={true} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
          Left Click to Rotate • Scroll to Zoom
        </div>
      </div>
    </div>
  );
}

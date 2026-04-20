"use client";

import { useState } from "react";
import { Sparkles, Package, Diamond, Scissors, Layers, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import ImageUpload from "./components/ui/ImageUpload";
import { designApi } from "./lib/api";
import ModelViewer from "./components/ModelViewer";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("furniture");
  const [style, setStyle] = useState("photorealistic");
  const [jewelrySpecs, setJewelrySpecs] = useState({ material: "", stone: "", size: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrls, setResultUrls] = useState<any>(null);

  const LOADING_STEPS = [
    "Analyzing prompt concept...",
    "Initializing neural core...",
    "Sculpting 3D geometry...",
    "Voxelizing mesh structure...",
    "Optimizing topology...",
    "Applying PBR materials...",
    "Finalizing assets..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setLoadingStep(0);
    setError(null);
    setResultUrls(null);

    // Simulated progress steps for better UX
    const progressInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);

    try {
      let result;
      if (selectedImage) {
        result = await designApi.generateFromImage(prompt, category, selectedImage);
      } else {
        if (!prompt) {
          setError("Please enter a prompt first.");
          setIsGenerating(false);
          clearInterval(progressInterval);
          return;
        }
        result = await designApi.generateFromText(prompt, category);
      }
      setResultUrls({
        glb_url: result.model_glb_url,
        obj_url: result.model_obj_url,
        stl_url: result.model_stl_url
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to generate model. Check your connection.");
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />

      <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Create 3D Assets <br /> 
            <span className="text-indigo-400">Instantly from AI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our app connects to a high-performance 3D engine to transform your ideas into reality.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 animate-in fade-in zoom-in-95">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Text Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Generation Prompt</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your 3D model in detail..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    required={!selectedImage}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                      <option value="furniture">🛋️ Furniture</option>
                      <option value="jewelry">💍 Jewelry</option>
                      <option value="character">👤 Character</option>
                      <option value="weapon">⚔️ Weapon</option>
                      <option value="prop">📦 Prop</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Style</label>
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                      <option value="photorealistic">Photorealistic</option>
                      <option value="low-poly">Low Poly</option>
                      <option value="digital-art">Digital Art</option>
                      <option value="stylized">Stylized</option>
                    </select>
                  </div>
                </div>

                {category === "jewelry" && (
                   <div className="pt-4 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Diamond size={16} />
                      <h3 className="text-xs font-bold uppercase tracking-widest">Jewelry Settings</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input 
                        placeholder="Material" 
                        value={jewelrySpecs.material}
                        onChange={(e) => setJewelrySpecs({...jewelrySpecs, material: e.target.value})}
                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" 
                      />
                      <input 
                        placeholder="Stone" 
                        value={jewelrySpecs.stone}
                        onChange={(e) => setJewelrySpecs({...jewelrySpecs, stone: e.target.value})}
                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" 
                      />
                      <input 
                        placeholder="Size" 
                        value={jewelrySpecs.size}
                        onChange={(e) => setJewelrySpecs({...jewelrySpecs, size: e.target.value})}
                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-indigo-500/50 outline-none" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Reference Image (Optional)</label>
                <ImageUpload onImageSelect={setSelectedImage} />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt && !selectedImage)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-gray-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
                  <span>Generate 3D Model</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="mt-8 space-y-4 animate-in fade-in duration-700">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest transition-all">
                  <span className="text-indigo-400 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" />
                    {LOADING_STEPS[loadingStep]}
                  </span>
                  <span className="text-gray-500">{Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%</span>
                </div>
              </div>
            )}
          </form>

          {/* Results Area */}
          {resultUrls && (
            <div className="mt-12 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-500/10 rotate-12">
                <CheckCircle size={120} strokeWidth={1} />
              </div>

               <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Generation Successful!</h3>
                  <p className="text-gray-400 text-sm">Your vision has been brought to life. Preview and export below.</p>
                </div>
              </div>

              {/* 3D Viewer Integration */}
              <div className="mb-10 relative z-10">
                <ModelViewer glbUrl={resultUrls.glb_url} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {[
                  { label: "GLB Model", url: resultUrls.glb_url, type: "Recommended" },
                  { label: "OBJ Model", url: resultUrls.obj_url, type: "Standard" },
                  { label: "STL Model", url: resultUrls.stl_url, type: "3D Printing" }
                ].map((item, i) => (
                  <a 
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-black/40 border border-white/10 p-4 rounded-2xl hover:border-indigo-500/50 transition-all hover:bg-indigo-500/5"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{item.type}</span>
                       <Download size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="font-semibold text-white">{item.label}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {[
            { icon: <Package className="text-indigo-400" />, label: "Production Ready" },
            { icon: <Layers className="text-purple-400" />, label: "Optimized Mesh" },
            { icon: <Scissors className="text-blue-400" />, label: "Clean UVs" },
            { icon: <Sparkles className="text-pink-400" />, label: "AI Enhanced" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              {item.icon}
              <span className="text-xs font-medium text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

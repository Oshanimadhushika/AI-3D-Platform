"use client";

import { useState } from "react";
import { Sparkles, Package, Diamond, Scissors, Layers } from "lucide-react";
import ImageUpload from "./components/ui/ImageUpload";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("furniture");
  const [style, setStyle] = useState("photorealistic");
  const [jewelrySpecs, setJewelrySpecs] = useState({ material: "", stone: "", size: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => setIsGenerating(false), 2000);
    console.log("Generating with:", { prompt, category, style, jewelrySpecs, selectedImage });
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />

      <div className="w-full max-w-4xl py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Create 3D Assets <br /> 
            <span className="text-indigo-400">Instantly from AI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transform text or images into production-ready 3D models.
            Perfect for games, visualization, and rapid prototyping.
          </p>
        </div>

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
              type="submit"
              disabled={isGenerating || (!prompt && !selectedImage)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Asset...
                </>
              ) : (
                <>
                  <Sparkles className="group-hover:animate-pulse text-indigo-200" />
                  Generate 3D Model
                </>
              )}
            </button>
          </form>
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

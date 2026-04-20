import { Sparkles, Package, Diamond, Scissors, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />

      <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Create 3D Assets <br /> 
            <span className="text-indigo-400">Instantly from Text</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our advanced AI transforms your words into production-ready 3D models.
            Perfect for games, visualization, and rapid prototyping.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Generation Prompt</label>
              <textarea 
                placeholder="Describe your 3D model in detail... (e.g. A futuristic cyberpunk sneakers with neon highlights)"
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Asset Category</label>
                <div className="relative">
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer">
                    <option value="furniture">🛋️ Furniture</option>
                    <option value="jewelry">💍 Jewelry</option>
                    <option value="character">👤 Character</option>
                    <option value="weapon">⚔️ Weapon</option>
                    <option value="prop">📦 Prop</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Style Preset</label>
                <div className="relative">
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer">
                    <option value="photorealistic">Photorealistic</option>
                    <option value="low-poly">Low Poly</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="stylized">Stylized</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Jewelry Specific Options (Conditionally visible in a real app) */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Diamond size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Jewelry Specifics (Optional)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Material</label>
                  <input type="text" placeholder="Gold, Silver..." className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Stone Type</label>
                  <input type="text" placeholder="Diamond, Ruby..." className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Size</label>
                  <input type="text" placeholder="Size (mm)..." className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="group-hover:animate-pulse" />
              Generate 3D Model
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

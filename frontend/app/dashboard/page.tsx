"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Filter, MoreVertical, Download, ExternalLink, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { designApi } from "../lib/api";

interface Design {
  id: number;
  prompt: string;
  category: string;
  model_glb_url?: string;
  model_obj_url?: string;
  model_stl_url?: string;
  source_image_url?: string;
  rendered_image_url?: string;
  created_at: string;
}

const CATEGORIES = ["All", "Jewelry", "Fashion"];

// Simple global cache for designs to prevent flickering on navigation
let designsCache: Design[] | null = null;

export default function Dashboard() {
  const [designs, setDesigns] = useState<Design[]>(designsCache || []);
  const [isLoading, setIsLoading] = useState(!designsCache);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    if (!designsCache) setIsLoading(true);
    setError(null);
    try {
      const data = await designApi.getDesigns();
      // Map potential 'clothing' to 'fashion' for filter consistency
      const mappedData = data.map((d: any) => ({
        ...d,
        category: d.category === "clothing" ? "Fashion" : d.category
      }));
      setDesigns(mappedData);
      designsCache = mappedData;
    } catch (err) {
      console.error("Failed to fetch designs:", err);
      setError("Could not load your designs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this design?")) return;

    // Optimistic Update: Immediately remove from UI
    const previousDesigns = [...designs];
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    designsCache = designsCache?.filter((d) => d.id !== id) || null;

    try {
      await designApi.deleteDesign(id);
    } catch (err) {
      console.error("Failed to delete design:", err);
      alert("Failed to delete the design. Restoring...");
      // Revert if failed
      setDesigns(previousDesigns);
      designsCache = previousDesigns;
    }
  };

  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const matchesSearch = (design.prompt || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || design.category?.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, designs]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Design Library</h1>
          <p className="text-gray-500 text-sm">Your private collection of AI-generated assets.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5">
          <Plus size={20} />
          <span>Start Generating</span>
        </Link>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Persistence / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by description..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm placeholder-gray-600 shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? "bg-white text-black shadow-lg" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-500 gap-5">
          <Loader2 className="animate-spin text-white/20" size={48} />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Syncing Library</p>
        </div>
      ) : filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {filteredDesigns.map((design) => {
            const isJewelry = design.category?.toLowerCase() === 'jewelry';
            const accentClass = isJewelry ? "text-yellow-500" : "text-violet-400";
            const borderClass = isJewelry ? "border-yellow-500/20" : "border-violet-500/20";
            const bgClass = isJewelry ? "from-yellow-500/5 to-transparent" : "from-violet-500/5 to-transparent";

            return (
              <div key={design.id} className={`group bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500 shadow-2xl relative`}>
                {/* Image Area */}
                <div className={`h-64 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${bgClass}`}>
                  {(design.rendered_image_url || design.source_image_url) ? (
                    <img 
                      src={design.rendered_image_url || design.source_image_url} 
                      alt={design.prompt} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-white/5 animate-pulse">
                      <PackageIcon size={64} strokeWidth={0.5} />
                    </div>
                  )}
                  
                  {/* Glass Header */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start pointer-events-none">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-xl border pointer-events-auto ${
                      isJewelry ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-violet-500/10 text-violet-500 border-violet-500/20"
                    }`}>
                      {design.category}
                    </span>
                    
                    <button 
                      onClick={() => handleDelete(design.id)}
                      className="p-2.5 bg-black/40 backdrop-blur-xl border border-white/10 text-gray-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/20 transition-all pointer-events-auto opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-5 left-5 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Ready</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                      {design.prompt}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Modified {new Date(design.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a 
                      href={design.model_glb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold bg-white/5 hover:bg-white text-gray-400 hover:text-black transition-all border border-white/5 group/btn"
                    >
                      <Download size={16} className="group-hover/btn:scale-110 transition-transform" />
                      Download GLB
                    </a>
                    <Link 
                      href="/"
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 transition-all group/icon ${accentClass} hover:bg-white/10`}
                    >
                      <ExternalLink size={20} className="group-hover/icon:scale-110 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
            <Search size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold text-lg">No designs found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); fetchDesigns(); }}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium pt-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function PackageIcon({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}

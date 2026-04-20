"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Filter, MoreVertical, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

const MOCK_DESIGNS = [
  { id: 1, prompt: "Elven Cottage", category: "Building", status: "Completed", date: "2026-04-20" },
  { id: 2, prompt: "Cyberpunk Sneakers", category: "Apparel", status: "Completed", date: "2026-04-19" },
  { id: 3, prompt: "Dragon Pendant", category: "Jewelry", status: "Processing", date: "2026-04-20" },
  { id: 4, prompt: "Modern Coffee Table", category: "Furniture", status: "Completed", date: "2026-04-18" },
  { id: 5, prompt: "Vintage Radio", category: "Prop", status: "Completed", date: "2026-04-17" },
  { id: 6, prompt: "Gothic Crown", category: "Jewelry", status: "Failed", date: "2026-04-16" },
];

const CATEGORIES = ["All", "Building", "Apparel", "Jewelry", "Furniture", "Prop"];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDesigns = useMemo(() => {
    return MOCK_DESIGNS.filter((design) => {
      const matchesSearch = design.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || design.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Your Designs</h1>
          <p className="text-gray-400 text-sm">Manage and download your AI-generated 3D assets.</p>
        </div>
        <Link href="/" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={20} />
          <span>New Generation</span>
        </Link>
      </header>

      {/* Persistence / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prompt name..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
              <div className="h-48 bg-black/40 relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                <div className="z-10 text-white/20">
                   <PackageIcon size={48} strokeWidth={1} />
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    design.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    design.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {design.status}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white line-clamp-1">{design.prompt}</h3>
                    <p className="text-xs text-gray-500">{design.category} • {design.date}</p>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    design.status === 'Completed' ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white/5 opacity-50 cursor-not-allowed text-gray-500 border border-transparent'
                  }`}>
                    <Download size={16} />
                    Download
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
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

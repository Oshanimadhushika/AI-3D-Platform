import { Search, Plus, Filter, MoreVertical, Download, ExternalLink } from "lucide-react";

const MOCK_DESIGNS = [
  { id: 1, prompt: "Elven Cottage", category: "Building", status: "Completed", date: "2026-04-20" },
  { id: 2, prompt: "Cyberpunk Sneakers", category: "Apparel", status: "Completed", date: "2026-04-19" },
  { id: 3, prompt: "Dragon Pendant", category: "Jewelry", status: "Processing", date: "2026-04-20" },
  { id: 4, prompt: "Modern Coffee Table", category: "Furniture", status: "Completed", date: "2026-04-18" },
  { id: 5, prompt: "Vintage Radio", category: "Prop", status: "Completed", date: "2026-04-17" },
  { id: 6, prompt: "Gothic Crown", category: "Jewelry", status: "Failed", date: "2026-04-16" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Your Designs</h1>
          <p className="text-gray-400">Manage and download your AI-generated 3D assets.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
          <Plus size={20} />
          <span>New Generation</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search designs..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {MOCK_DESIGNS.map((design) => (
          <div key={design.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
            {/* Mock Preview Area */}
            <div className="h-48 bg-black/40 relative flex items-center justify-center border-b border-white/5 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
               <div className="z-10 text-white/20">
                 <PackageIcon size={48} strokeWidth={1} />
               </div>
               
               {/* Overlay Status Badge */}
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

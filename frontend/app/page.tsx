"use client";

import { useState } from "react";
import { Sparkles, Download, CheckCircle, AlertCircle, Loader2, Gem, Shirt } from "lucide-react";
import { designApi } from "./lib/api";
import ModelViewer from "./components/ModelViewer";
import CustomSelect, { SelectOption } from "./components/ui/CustomSelect";
import ImageUpload from "./components/ui/ImageUpload";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "jewelry" | "clothing";

interface JewelryForm {
  prompt: string;
  category: string;
  material: string;
  stone: string;
  dimensions: {
    ring_size?: string;
    band_width?: string;
    chain_length?: string;
    pendant_size?: string;
    wrist_size?: string;
    bracelet_width?: string;
    drop_height?: string;
  };
}

interface ClothingForm {
  prompt: string;
  garment_type: string;
}

// ─── Loading Steps ────────────────────────────────────────────────────────────
const LOADING_STEPS = [
  "Analyzing your concept...",
  "Initializing neural sculpting engine...",
  "Generating base geometry...",
  "Applying material shaders...",
  "Refining mesh topology...",
  "Rendering final model...",
  "Packaging assets...",
];

function TextareaField({ label, id, value, onChange, placeholder, required }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  placeholder: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label} {required && <span className="text-xs text-gray-500">(required)</span>}
      </label>
      <textarea
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all resize-none text-sm"
      />
    </div>
  );
}

// ─── Jewelry Generator Tab ────────────────────────────────────────────────────
function JewelryTab({ onSubmit, isGenerating }: {
  onSubmit: (prompt: string, options: Record<string, string>, image?: File | null) => void;
  isGenerating: boolean;
}) {
  const [form, setForm] = useState<JewelryForm>({
    prompt: "", 
    category: "ring",
    material: "gold", 
    stone: "diamond", 
    dimensions: {},
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options: Record<string, string> = { 
      category: form.category,
      material: form.material, 
      stone: form.stone,
      ...form.dimensions
    };
    onSubmit(form.prompt, options, selectedImage);
  };

  const set = (key: keyof JewelryForm) => (val: any) => setForm((f) => ({ ...f, [key]: val }));
  const setDim = (key: keyof JewelryForm["dimensions"]) => (val: string) => 
    setForm((f) => ({ ...f, dimensions: { ...f.dimensions, [key]: val } }));

  const categoryOptions: SelectOption[] = [
    { value: "ring", label: "Ring", icon: <Gem size={14} /> },
    { value: "necklace", label: "Necklace", icon: <Sparkles size={14} /> },
    { value: "bracelet", label: "Bracelet", icon: <div className="w-3 h-3 rounded-full border-2 border-yellow-500" /> },
    { value: "earring", label: "Earring", icon: <div className="w-1.5 h-3 rounded-full bg-yellow-500" /> },
  ];

  const materialOptions: SelectOption[] = [
    { value: "gold", label: "Gold", icon: <Sparkles size={14} /> },
    { value: "white_gold", label: "White Gold", icon: <div className="w-3 h-3 rounded-full bg-slate-200" /> },
    { value: "silver", label: "Silver", icon: <div className="w-3 h-3 rounded-full bg-slate-400" /> },
    { value: "rose_gold", label: "Rose Gold", icon: <div className="w-3 h-3 rounded-full bg-rose-300" /> },
    { value: "platinum", label: "Platinum", icon: <Gem size={14} /> },
  ];

  const stoneOptions: SelectOption[] = [
    { value: "diamond", label: "Diamond", icon: <Gem size={14} /> },
    { value: "emerald", label: "Emerald", icon: <div className="w-3 h-3 rounded-full bg-emerald-500" /> },
    { value: "ruby", label: "Ruby", icon: <div className="w-3 h-3 rounded-full bg-red-500" /> },
    { value: "sapphire", label: "Sapphire", icon: <div className="w-3 h-3 rounded-full bg-blue-500" /> },
    { value: "no_stone", label: "No Stone", icon: <div className="w-3 h-3 rounded-full border border-dashed border-gray-600" /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <TextareaField
            label="Design Concept" id="jewelry-prompt"
            value={form.prompt} onChange={set("prompt")}
            placeholder="Describe your vision (e.g. Vintage art-deco ring with intricate floral patterns...)"
            required
          />

          <div className="grid grid-cols-2 gap-4">
             <CustomSelect 
              label="Item Type" id="category" value={form.category} onChange={set("category")}
              options={categoryOptions} accentClass="text-yellow-400" ringClass="focus:ring-yellow-500/30"
            />
            <CustomSelect 
              label="Primary Material" id="material" value={form.material} onChange={set("material")}
              options={materialOptions} accentClass="text-yellow-400" ringClass="focus:ring-yellow-500/30"
            />
          </div>

          <div className="space-y-5 pt-2">
            <CustomSelect 
              label="Center Stone" id="stone" value={form.stone} onChange={set("stone")}
              options={stoneOptions} accentClass="text-yellow-400" ringClass="focus:ring-yellow-500/30"
            />

            {/* Dynamic Dimension Spec Sheet */}
            <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Engineering Specs</p>
                <div className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-medium text-gray-600 border border-white/5">Units: Metric / Imperial</div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {form.category === "ring" && (
                  <>
                    <SpecInput label="Ring Size" placeholder="7" unit="US/EU" value={form.dimensions.ring_size} onChange={setDim("ring_size")} />
                    <SpecInput label="Band Width" placeholder="2.5" unit="mm" value={form.dimensions.band_width} onChange={setDim("band_width")} />
                  </>
                )}
                {form.category === "necklace" && (
                  <>
                    <SpecInput label="Chain Length" placeholder="45" unit="cm" value={form.dimensions.chain_length} onChange={setDim("chain_length")} />
                    <SpecInput label="Pendant Size" placeholder="12" unit="mm" value={form.dimensions.pendant_size} onChange={setDim("pendant_size")} />
                  </>
                )}
                {form.category === "bracelet" && (
                  <>
                    <SpecInput label="Wrist Cir." placeholder="170" unit="mm" value={form.dimensions.wrist_size} onChange={setDim("wrist_size")} />
                    <SpecInput label="Bracelet Width" placeholder="6" unit="mm" value={form.dimensions.bracelet_width} onChange={setDim("bracelet_width")} />
                  </>
                )}
                {form.category === "earring" && (
                  <>
                    <SpecInput label="Drop Height" placeholder="25" unit="mm" value={form.dimensions.drop_height} onChange={setDim("drop_height")} />
                    <SpecInput label="Style" placeholder="Hoop" unit="Type" value={form.dimensions.ring_size} onChange={setDim("ring_size")} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Visual Inspiration</label>
          <ImageUpload onImageSelect={setSelectedImage} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-500 disabled:opacity-40 text-black font-bold py-4 rounded-2xl transition-all shadow-xl shadow-yellow-600/30 flex items-center justify-center gap-3 group text-sm tracking-wide"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        {isGenerating ? (
          <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /><span>Crafting Masterpiece...</span></>
        ) : (
          <><Gem size={18} /><span>Generate 3D Product Model</span></>
        )}
      </button>
    </form>
  );
}

function SpecInput({ label, placeholder, unit, value = "", onChange }: { label: string; placeholder: string; unit: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-3 pr-12 text-white text-xs placeholder-gray-700 focus:outline-none focus:border-yellow-500/30 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-700 select-none group-focus-within:text-yellow-500/50">
          {unit}
        </div>
      </div>
    </div>
  );
}



// ─── Clothing Generator Tab ───────────────────────────────────────────────────
function ClothingTab({ onSubmit, isGenerating }: {
  onSubmit: (prompt: string, options: Record<string, string>, image?: File | null) => void;
  isGenerating: boolean;
}) {
  const [form, setForm] = useState<ClothingForm>({ prompt: "", garment_type: "hoodie" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form.prompt, { garment_type: form.garment_type }, selectedImage);
  };

  const set = (key: keyof ClothingForm) => (val: string) => setForm((f: ClothingForm) => ({ ...f, [key]: val }));

  const garmentOptions: SelectOption[] = [
    { value: "hoodie", label: "Hoodie", icon: <Shirt size={14} /> },
    { value: "t-shirt", label: "T-Shirt", icon: <Shirt size={14} /> },
    { value: "jacket", label: "Jacket", icon: <Shirt size={14} /> },
    { value: "dress", label: "Dress", icon: <Shirt size={14} /> },
    { value: "pants", label: "Pants / Skirt", icon: <div className="w-3 h-3 rounded-sm border border-violet-400" /> },
    { value: "sneakers", label: "Sneakers / Shoes", icon: <div className="w-3.5 h-2 bg-violet-400 rounded-sm" /> },
    { value: "boots", label: "Boots", icon: <div className="w-3 h-3 bg-violet-500 rounded-sm" /> },
    { value: "hat", label: "Hat / Cap", icon: <div className="w-3 h-1.5 bg-violet-400 rounded-full" /> },
    { value: "backpack", label: "Bag / Backpack", icon: <div className="w-3 h-3 border-2 border-violet-400 rounded-md" /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <TextareaField
            label="Describe Your Garment" id="clothing-prompt"
            value={form.prompt} onChange={set("prompt")}
            placeholder="e.g. A slim-fit blazer with single button, navy blue, modern cut..."
          />

          <CustomSelect 
            label="Garment Type" id="garment-type" value={form.garment_type} onChange={set("garment_type")}
            options={garmentOptions} accentClass="text-violet-400" ringClass="focus:ring-violet-500/30"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Reference Image (Optional)</label>
          <ImageUpload onImageSelect={setSelectedImage} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 hover:from-violet-500 hover:via-indigo-400 hover:to-violet-500 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-violet-600/30 flex items-center justify-center gap-3 group text-sm tracking-wide"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        {isGenerating ? (
          <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /><span>Designing...</span></>
        ) : (
          <><Shirt size={18} /><span>Generate Clothing Model</span></>
        )}
      </button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("jewelry");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrls, setResultUrls] = useState<any>(null);

  const handleGenerate = async (prompt: string, options: Record<string, string>, image?: File | null) => {
    setIsGenerating(true);
    setLoadingStep(0);
    setError(null);
    setResultUrls(null);

    const progressInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);

    try {
      let result;
      if (image) {
        // Image to 3D with options
        result = await designApi.generateFromImage(prompt, activeTab, image, options);
      } else {
        // Text to 3D with options
        result = await designApi.generateFromText(prompt, activeTab, options);
      }
      
      setResultUrls({
        glb_url: result.model_glb_url,
        obj_url: result.model_obj_url,
        stl_url: result.model_stl_url,
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to generate model. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const isJewelry = activeTab === "jewelry";

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden py-12">
      {/* Themed Background Orbs */}
      {isJewelry ? (
        <>
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[150px] -z-10 transition-all duration-1000" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[150px] -z-10 transition-all duration-1000" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] -z-10 transition-all duration-1000" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] -z-10 transition-all duration-1000" />
        </>
      )}

      <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-500 ${
            isJewelry
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              : "bg-violet-500/10 text-violet-400 border-violet-500/20"
          }`}>
            <Sparkles size={12} />
            AI 3D Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {isJewelry ? (
              <>Craft Luxury <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Jewelry</span></>
            ) : (
              <>Design Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Fashion</span></>
            )}
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {isJewelry
              ? "Photorealistic 3D jewelry models from your imagination to production-ready assets."
              : "Realistic 3D garment models with accurate fabric simulation and texturing."
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/[0.04] p-1 rounded-2xl border border-white/10 gap-1">
          {([
            { id: "jewelry" as Tab, label: "Jewelry", Icon: Gem, activeClass: "bg-gradient-to-r from-yellow-600 to-amber-500 text-black shadow-lg shadow-yellow-500/30" },
            { id: "clothing" as Tab, label: "Fashion", Icon: Shirt, activeClass: "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30" },
          ] as const).map(({ id, label, Icon, activeClass }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setError(null); setResultUrls(null); }}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === id ? activeClass : "text-gray-500 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label} Studio
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 animate-in fade-in zoom-in-95">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className={`rounded-3xl p-6 md:p-8 backdrop-blur-xl border shadow-2xl transition-all duration-500 ${
          isJewelry
            ? "bg-[#0d0a00]/80 border-yellow-500/15 shadow-yellow-900/20"
            : "bg-[#05030f]/80 border-violet-500/15 shadow-violet-900/20"
        }`}>
          {/* Tab indicator header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isJewelry ? "bg-yellow-500/15 text-yellow-400" : "bg-violet-500/15 text-violet-400"
            }`}>
              {isJewelry ? <Gem size={18} /> : <Shirt size={18} />}
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">{isJewelry ? "Jewelry Generator" : "Fashion & Style Generator"}</h2>
              <p className="text-gray-600 text-xs">{isJewelry ? "Luxury • Photorealistic • Production-ready" : "Apparel • Footwear • Accessories"}</p>
            </div>
          </div>

          {activeTab === "jewelry"
            ? <JewelryTab onSubmit={handleGenerate} isGenerating={isGenerating} />
            : <ClothingTab onSubmit={handleGenerate} isGenerating={isGenerating} />
          }

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-6 space-y-2 animate-in fade-in duration-500">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${
                    isJewelry ? "bg-gradient-to-r from-yellow-600 to-amber-400" : "bg-gradient-to-r from-violet-600 to-indigo-400"
                  }`}
                  style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={`flex items-center gap-1.5 ${isJewelry ? "text-yellow-400" : "text-violet-400"}`}>
                  <Loader2 size={11} className="animate-spin" />
                  {LOADING_STEPS[loadingStep]}
                </span>
                <span className="text-gray-600">{Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {resultUrls && (
          <div className={`p-6 md:p-8 rounded-3xl border animate-in fade-in zoom-in-95 duration-500 ${
            isJewelry
              ? "bg-yellow-500/5 border-yellow-500/15"
              : "bg-violet-500/5 border-violet-500/15"
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isJewelry ? "bg-yellow-500/20 text-yellow-400" : "bg-violet-500/20 text-violet-400"
              }`}>
                <CheckCircle size={22} />
              </div>
              <div>
                <h3 className="text-white font-bold">Model Generated!</h3>
                <p className="text-gray-500 text-xs">Your 3D asset is ready to preview and export.</p>
              </div>
            </div>

            <div className="mb-6">
              <ModelViewer glbUrl={resultUrls.glb_url} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "GLB Model", url: resultUrls.glb_url, badge: "Recommended" },
                { label: "OBJ Model", url: resultUrls.obj_url, badge: "Universal" },
                { label: "STL Model", url: resultUrls.stl_url, badge: "3D Print" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col gap-1.5 p-4 rounded-2xl border transition-all ${
                    !item.url ? "opacity-40 pointer-events-none" : ""
                  } ${
                    isJewelry
                      ? "bg-black/30 border-yellow-500/10 hover:border-yellow-500/40 hover:bg-yellow-500/5"
                      : "bg-black/30 border-violet-500/10 hover:border-violet-500/40 hover:bg-violet-500/5"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      isJewelry ? "text-yellow-500" : "text-violet-400"
                    }`}>{item.badge}</span>
                    <Download size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

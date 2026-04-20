"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelect(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
          preview 
            ? "border-indigo-500/50 bg-indigo-500/5" 
            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {preview ? (
          <div className="w-full h-full p-4 relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-2xl shadow-xl transition-transform group-hover:scale-[1.02]"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-6 right-6 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-6 left-6 px-3 py-1 bg-indigo-600/90 backdrop-blur-md rounded-full text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 size={12} />
              READY FOR GENERATION
            </div>
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="text-indigo-400" size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-white font-semibold">Click to upload image</p>
              <p className="text-gray-500 text-sm">PNG, JPG or WebP (max 10MB)</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[11px] text-indigo-300">
        <ImageIcon size={14} />
        <span>AI will use this image as a reference for 3D generation.</span>
      </div>
    </div>
  );
}

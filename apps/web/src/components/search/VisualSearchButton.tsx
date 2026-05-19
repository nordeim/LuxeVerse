"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";

export function VisualSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Wire to AI visual search endpoint
      console.log("Uploading for visual search:", file.name);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-obsidian-200 text-obsidian-600 hover:border-neon-cyan hover:text-neon-cyan transition-all"
        aria-label="Visual search"
      >
        <Camera className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-obsidian-950/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-dramatic animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Visual search upload"
          >
            <h3 className="mb-2 text-lg font-display font-medium text-obsidian-900">Find by Image</h3>
            <p className="mb-4 text-sm text-obsidian-600">Upload a photo to discover similar pieces from our atelier.</p>
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-obsidian-300 p-8 hover:border-neon-cyan hover:bg-obsidian-100/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            >
              <Camera className="h-8 w-8 mb-2 text-obsidian-400" />
              <span className="text-sm font-medium text-obsidian-700">Click or drag image here</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full text-sm text-obsidian-500 hover:text-obsidian-800 underline underline-offset-4 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

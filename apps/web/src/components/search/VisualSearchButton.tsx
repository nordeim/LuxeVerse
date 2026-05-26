"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { trpc } from "@/trpc";

export function VisualSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<
    Array<{
      id: string;
      name: string;
      similarity: number;
      imageUrl: string;
      price: number;
      category: string;
      slug: string;
    }> | null
  >(null);

  const visualSearchMutation = trpc.visualSearch.search.useMutation({
    onSuccess: (data) => {
      setResults(data.results);
      setIsUploading(false);
    },
    onError: (error) => {
      console.error("[VisualSearch] Error:", error);
      setIsUploading(false);
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResults(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data:image/... prefix
      const base64Data = base64.split(",")[1] ?? "";
      visualSearchMutation.mutate({ imageBase64: base64Data });
    };
    reader.readAsDataURL(file);
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
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-obsidian-950/50 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false);
            setResults(null);
          }}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-dramatic animate-fade-in-up max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Visual search"
          >
            <h3 className="mb-2 text-lg font-display font-medium text-obsidian-900">
              Find by Image
            </h3>
            <p className="mb-4 text-sm text-obsidian-600">
              Upload a photo to discover similar pieces from our atelier.
            </p>

            {/* Upload Area */}
            {!results && !isUploading && (
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-obsidian-300 p-8 hover:border-neon-cyan hover:bg-obsidian-100/50 transition-all cursor-pointer"
                onClick={() => document.getElementById("visual-search-input")?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    document.getElementById("visual-search-input")?.click();
                }}
              >
                <Camera className="h-8 w-8 mb-2 text-obsidian-400" />
                <span className="text-sm font-medium text-obsidian-700">
                  Click or drag image here
                </span>
                <input
                  id="visual-search-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
            )}

            {/* Loading State */}
            {isUploading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mb-4" />
                <p className="text-sm text-obsidian-600">Analyzing image...</p>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-obsidian-900">
                  {results.length} similar items found
                </h4>
                <div className="grid gap-4">
                  {results.map((item) => (
                    <a
                      key={item.id}
                      href={`/shop/${item.category}/${item.slug}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-obsidian-100 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg bg-obsidian-100 overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-obsidian-900 truncate">
                          {item.name}
                        </h5>
                        <p className="text-xs text-obsidian-600">
                          ${item.price} · {Math.round(item.similarity * 100)}% match
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setResults(null);
              }}
              className="mt-6 w-full text-sm text-obsidian-500 hover:text-obsidian-800 underline underline-offset-4 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

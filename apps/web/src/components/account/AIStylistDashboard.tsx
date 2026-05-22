"use client";

import { useState } from "react";
import { cn } from "@luxeverse/utils";
import { Button } from "@luxeverse/ui";
import { OutfitCard } from "@/components/ai-stylist/OutfitCard";
import { StyleChat } from "@/components/ai-stylist/StyleChat";
interface AIStylistDashboardProps {
  userId: string;
}

type Tab = "outfits" | "chat";

export function AIStylistDashboard({ userId }: AIStylistDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("outfits");

  return (
    <div className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-display font-medium text-obsidian-900">
          AI Stylist
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("outfits")}
            className={cn(
              "rounded-lg px-3 py-1 text-sm font-medium transition-colors",
              activeTab === "outfits"
                ? "bg-obsidian-900 text-obsidian-50"
                : "text-obsidian-600 hover:bg-obsidian-100"
            )}
          >
            Outfits
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={cn(
              "rounded-lg px-3 py-1 text-sm font-medium transition-colors",
              activeTab === "chat"
                ? "bg-obsidian-900 text-obsidian-50"
                : "text-obsidian-600 hover:bg-obsidian-100"
            )}
          >
            Chat
          </button>
        </div>
      </div>

      {activeTab === "outfits" && (
        <div className="space-y-4">
          <OutfitCard
            outfit={null}
            onItemClick={(productId) => {
              console.log("Clicked product:", productId);
            }}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // This would trigger generateOutfit tRPC mutation
              console.log("Generate new outfit");
            }}
          >
            Generate New Outfit
          </Button>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="h-[400px]">
          <StyleChat userId={userId} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { trpc } from "../../trpc";
import { OutfitCard } from "../ai-stylist/OutfitCard";
import { StyleChat } from "../ai-stylist/StyleChat";
import { SizeRecommendation } from "../size/SizeRecommendation";
import { cn } from "@luxeverse/utils";
import type { OutfitResponse } from "../../lib/ai.types";

interface PersonalizedGridProps {
  userId: string;
  className?: string;
}

export function PersonalizedGrid({ userId, className }: PersonalizedGridProps) {
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitResponse | null>(null);
  const [selectedSize, setSelectedSize] = useState<import("../../lib/ai.types").SizeRecommendation | null>(null);

  const getOutfit = trpc.ai.generateOutfit.useMutation();
  const getSizeAdvice = trpc.ai.getSizeAdvice.useMutation();

  const handleGenerateOutfit = useCallback(() => {
    getOutfit.mutate(
      {
        persona: "minimalist",
        occasion: "cocktail",
        season: "autumn",
        favoriteColors: ["obsidian", "champagne"],
        budget: 2000,
        category: "tailoring",
      } as any,
      {
        onSuccess: (data) => {
          setSelectedOutfit(data);
        },
      }
    );
  }, [getOutfit]);

  const handleGetSizeAdvice = useCallback(() => {
    getSizeAdvice.mutate(
      {
        userId: userId ?? "user-1",
        height: 175,
        weight: 68,
        bodyType: "athletic",
        brand: "Saint Laurent",
        itemCategory: "bottoms",
      } as any,
      {
        onSuccess: (data) => {
          setSelectedSize(data);
        },
      }
    );
  }, [getSizeAdvice, userId]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <StyleChat userId={userId} className="h-[500px]" />
      </div>
      <div className="space-y-4">
        <button type="button" onClick={handleGenerateOutfit} className="w-full">
          Generate Outfit
        </button>
        <OutfitCard
          outfit={selectedOutfit}
          className="w-full"
          onItemClick={(productId) => {
            console.log("Clicked product:", productId);
          }}
        />
        <button type="button" onClick={handleGetSizeAdvice} className="w-full">
          Get Size Advice
        </button>
        <SizeRecommendation
          recommendation={selectedSize}
          className="w-full"
          onGetAdvice={handleGetSizeAdvice}
        />
      </div>
    </div>
  );
}

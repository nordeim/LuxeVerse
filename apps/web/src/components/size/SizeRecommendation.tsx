"use client";

import { cn } from "@luxeverse/utils";
import type { SizeRecommendation } from "../../lib/ai.types";

interface SizeRecommendationProps {
  recommendation: SizeRecommendation | null;
  className?: string;
  onGetAdvice?: () => void;
}

export function SizeRecommendation({ recommendation, className, onGetAdvice }: SizeRecommendationProps) {
  if (!recommendation) {
    return (
      <button
        type="button"
        onClick={onGetAdvice}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border border-obsidian-200 bg-obsidian-50 p-8 text-center transition-colors hover:bg-obsidian-100",
          className
        )}
      >
        <span className="text-sm font-medium text-obsidian-900">Get Size Recommendation</span>
        <span className="mt-1 text-xs text-obsidian-600">
          Answer a few questions for a personalized fit
        </span>
      </button>
    );
  }

  const confidencePercent = Math.round(recommendation.confidence * 100);

  return (
    <div
      className={cn(
        "rounded-xl border border-obsidian-200 bg-obsidian-50 p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-metallic-champagne font-display font-medium text-obsidian-950">
          {recommendation.size}
        </div>
        <div>
          <h3 className="text-sm font-medium text-obsidian-900">Recommended Size</h3>
          <p className="text-xs text-obsidian-600">{recommendation.reasoning}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-obsidian-600">Confidence</span>
          <span className="text-xs font-medium text-obsidian-900">{confidencePercent}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-obsidian-200">
          <div
            className="h-full rounded-full bg-metallic-gold transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-obsidian-600">
          {recommendation.alternative && `Alternative: ${recommendation.alternative}`}
        </p>
      </div>
    </div>
  );
}

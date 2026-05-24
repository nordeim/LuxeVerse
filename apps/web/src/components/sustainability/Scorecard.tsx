"use client";

import { Card } from "@/components/ui/Card";
import type { Product } from "@prisma/client";

interface ScorecardProps {
  product: Pick<
    Product,
    "sustainabilityScore" | "carbonFootprint" | "recycledContent" | "packaging"
  >;
}

export function Scorecard({ product }: ScorecardProps) {
  const score = product.sustainabilityScore ?? 0;
  const carbon = product.carbonFootprint ?? 0;
  const recycled = product.recycledContent ?? 0;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80 ? "text-success" : score >= 50 ? "text-metallic-gold" : "text-error";

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-display mb-4">Sustainability</h3>

        <div className="flex items-center gap-6">
          {/* Circular Score */}
          <div className="relative w-[120px] h-[120px]">
            <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--color-obsidian-200)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={scoreColor}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-display ${scoreColor}`}>
                {score}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {/* Carbon Footprint */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbon Footprint</span>
                <span>{carbon.toFixed(2)} kg CO₂</span>
              </div>
              <div className="h-2 bg-obsidian-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-metallic-gold transition-all"
                  style={{ width: `${Math.min(100, (carbon / 10) * 100)}%` }}
                />
              </div>
            </div>

            {/* Recycled Content */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Recycled Content</span>
                <span>{recycled}%</span>
              </div>
              <div className="h-2 bg-obsidian-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all"
                  style={{ width: `${recycled}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

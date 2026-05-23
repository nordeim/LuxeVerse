"use client";

import { trpc } from "@/trpc/index";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface PointsHistoryProps {
  userId: string;
}

export function PointsHistory({ userId }: PointsHistoryProps) {
  const { data: history, isLoading } = trpc.loyalty.getHistory.useQuery({
    userId,
  });

  if (isLoading) {
    return <div aria-label="Loading points history">Loading history...</div>;
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No points history yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-xl font-bold">Points History</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list" aria-label="Points history list">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-3 rounded-md bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      item.type === "EARNED"
                        ? "bg-green-100 text-green-800"
                        : item.type === "REDEEMED"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.type === "EARNED"
                      ? "+"
                      : item.type === "REDEEMED"
                      ? "−"
                      : "↻"}
                  </span>
                  <span className="font-medium">{item.description}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div
                className={`text-right font-mono font-bold ${
                  item.type === "EARNED"
                    ? "text-green-600"
                    : item.type === "REDEEMED"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {item.type === "EARNED" ? "+" : ""}
                {item.amount} pts
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

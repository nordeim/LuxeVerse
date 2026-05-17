interface PriceDisplayProps {
  current: number;
  compareAt: number | null;
  currency: string;
  installments?: { count: number; amount: number };
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
}

export function PriceDisplay({ current, compareAt, currency, installments }: PriceDisplayProps): JSX.Element {
  const hasDiscount = compareAt !== null && compareAt > current;
  const savings = hasDiscount ? compareAt - current : 0;

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-base font-semibold text-obsidian-900">
        {formatCurrency(current, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-obsidian-500 line-through">
            {formatCurrency(compareAt, currency)}
          </span>
          <span className="text-xs font-medium text-neon-pink">
            Save {formatCurrency(savings, currency)}
          </span>
        </>
      )}
      {installments && (
        <span className="text-xs text-obsidian-600">
          or {installments.count}x {formatCurrency(installments.amount, currency)}
        </span>
      )}
    </div>
  );
}

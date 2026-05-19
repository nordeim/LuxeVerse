export function SocialProof() {
  return (
    <section className="bg-obsidian-50 py-16 px-4 border-t border-b border-obsidian-200" aria-label="Social proof">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-display font-medium text-obsidian-900">4.9/5</span>
          <span className="text-xs text-obsidian-600 uppercase tracking-widest mt-1">Customer Rating</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-display font-medium text-obsidian-900">12k+</span>
          <span className="text-xs text-obsidian-600 uppercase tracking-widest mt-1">Global Collectors</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-display font-medium text-obsidian-900">Vogue</span>
          <span className="text-xs text-obsidian-600 uppercase tracking-widest mt-1">As Featured In</span>
        </div>
      </div>
    </section>
  );
}

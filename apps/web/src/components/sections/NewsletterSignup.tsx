"use client";

interface NewsletterProps {
  locale: string;
}

export function NewsletterSignup({ locale }: NewsletterProps) {
  const heading = locale === "fr" ? "Recevoir l'Édition" : "Receive the Edit";
  const tag = locale === "fr" ? "Restez Informé" : "Stay Informed";
  const body =
    locale === "fr"
      ? "Arrivées curées, histoires éditoriales et accès privé. Pas de bruit — seulement le signal."
      : "Curated arrivals, editorial stories, and private access. No noise — only signal.";
  const placeholder = locale === "fr" ? "Votre adresse email" : "Your email address";
  const cta = locale === "fr" ? "S'abonner" : "Subscribe";
  const privacy = locale === "fr" ? "En vous abonnant, vous acceptez notre politique de confidentialité. Vous pouvez vous désabonner à tout moment." : "By subscribing, you agree to our privacy policy. Unsubscribe at any time.";

  return (
    <section
      className="py-[var(--space-2xl)] md:py-[8rem] border-t border-obsidian-800"
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <div className="reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-metallic-champagne font-medium mb-[var(--space-xs)]">
            {tag}
          </p>
          <h2
            id="newsletter-heading"
            className="text-3xl md:text-4xl font-display font-light text-obsidian-50 mb-[var(--space-md)]"
          >
            {heading}
          </h2>
          <p className="text-base text-obsidian-400 font-light mb-[var(--space-xl)]">
            {body}
          </p>

          <form className="flex flex-col sm:flex-row gap-[var(--space-md)]" aria-label="Newsletter signup">
            <label htmlFor="newsletter-email" className="sr-only">
              {placeholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={placeholder}
              className="newsletter-input flex-1"
              autoComplete="email"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              {cta}
            </button>
          </form>

          <p className="text-xs text-obsidian-500 mt-[var(--space-md)]">{privacy}</p>
        </div>
      </div>
    </section>
  );
}

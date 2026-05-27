import type { ReactElement } from "react";
import Link from "next/link";
import { Instagram, PinIcon, Linkedin } from "lucide-react";

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps): ReactElement {
  const columns = [
    {
      title: locale === "fr" ? "Boutique" : "Shop",
      links: [
        locale === "fr" ? "Nouveautés" : "New Arrivals",
        locale === "fr" ? "Collections" : "Collections",
        locale === "fr" ? "Femme" : "Women",
        locale === "fr" ? "Homme" : "Men",
        locale === "fr" ? "Accessoires" : "Accessories",
      ],
    },
    {
      title: locale === "fr" ? "À Propos" : "About",
      links: [
        locale === "fr" ? "Notre Histoire" : "Our Story",
        locale === "fr" ? "Durabilité" : "Sustainability",
        locale === "fr" ? "Journal" : "Journal",
        locale === "fr" ? "Carrières" : "Careers",
        locale === "fr" ? "Presse" : "Press",
      ],
    },
    {
      title: locale === "fr" ? "Support" : "Support",
      links: [
        locale === "fr" ? "Contact" : "Contact",
        locale === "fr" ? "Expédition" : "Shipping",
        locale === "fr" ? "Retours" : "Returns",
        locale === "fr" ? "Guide des Tailles" : "Size Guide",
        locale === "fr" ? "FAQ" : "FAQ",
      ],
    },
    {
      title: locale === "fr" ? "Juridique" : "Legal",
      links: [
        locale === "fr" ? "Politique de Confidentialité" : "Privacy Policy",
        locale === "fr" ? "Conditions de Service" : "Terms of Service",
        locale === "fr" ? "Politique de Cookies" : "Cookie Policy",
        locale === "fr" ? "Accessibilité" : "Accessibility",
      ],
    },
  ];

  return (
    <footer className="border-t border-obsidian-800 py-[var(--space-2xl)]" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-6 md:px-[var(--space-xl)]">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-[var(--space-xl)] mb-[var(--space-2xl)]">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4">
            <Link
              href="/"
              className="text-2xl font-display font-light tracking-wider text-obsidian-50 hover:text-metallic-champagne transition-colors"
              aria-label="LuxeVerse home"
            >
              LuxeVerse
            </Link>
            <p className="text-xs text-obsidian-400 font-light mt-[var(--space-md)] max-w-xs leading-relaxed">
              {locale === "fr"
                ? "Une expérience de luxe cinématique. Curée par l'IA, artisanalement fabriquée, numériquement inégalée."
                : "A cinematic luxury experience. AI-curated, sustainably crafted, digitally unparalleled."}
            </p>
            {/* Social icons */}
            <div className="flex gap-[var(--space-md)] mt-[var(--space-lg)]">
              <a
                href="#"
                aria-label="Instagram"
                className="text-obsidian-500 hover:text-metallic-champagne transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="text-obsidian-500 hover:text-metallic-champagne transition-colors"
              >
                <PinIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-obsidian-500 hover:text-metallic-champagne transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title} className="md:col-span-2">
              <p className="text-xs tracking-[0.2em] uppercase text-obsidian-300 font-medium mb-[var(--space-md)]">
                {column.title}
              </p>
              <ul className="space-y-[var(--space-sm)]" role="list">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs text-obsidian-500 hover:text-metallic-champagne transition-colors font-light"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-[var(--space-lg)] border-t border-obsidian-800 flex flex-col md:flex-row items-center justify-between gap-[var(--space-md)]">
          <p className="text-xs text-obsidian-600 font-light">
            &copy; 2025 LuxeVerse. {locale === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-[var(--space-md)]">
            <span className="text-xs text-obsidian-600 font-light">
              {locale === "fr" ? "Devise:" : "Currency:"}
            </span>
            <button className="text-xs text-obsidian-400 hover:text-metallic-champagne transition-colors font-medium">
              USD $
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

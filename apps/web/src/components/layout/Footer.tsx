import type { ReactElement } from "react";
import Link from "next/link";

export function Footer(): ReactElement {
  return (
    <footer className="bg-obsidian-950 text-obsidian-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-display font-semibold mb-4 text-metallic-champagne">
            LuxeVerse
          </h3>
          <p className="text-sm text-obsidian-300">
            Cinematic luxury commerce.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-metallic-champagne uppercase tracking-wide">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-obsidian-300">
            <li>
              <Link href="/new" className="hover:text-metallic-champagne transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-metallic-champagne transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/sale" className="hover:text-metallic-champagne transition-colors">
                Sale
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-metallic-champagne uppercase tracking-wide">
            Support
          </h4>
          <ul className="space-y-2 text-sm text-obsidian-300">
            <li>
              <Link href="/contact" className="hover:text-metallic-champagne transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-metallic-champagne transition-colors">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-metallic-champagne transition-colors">
                Returns
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-metallic-champagne uppercase tracking-wide">
            Newsletter
          </h4>
          <p className="text-sm text-obsidian-300 mb-4">
            Join the inner circle.
          </p>
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg bg-obsidian-900 border border-obsidian-800 px-3 py-2 text-sm text-obsidian-50 placeholder:text-obsidian-500 focus:ring-2 focus:ring-neon-cyan focus:outline-hidden"
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 mt-12 pt-8 border-t border-obsidian-800 text-xs text-obsidian-400 flex justify-between">
        <span>&#169; 2026 LuxeVerse. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-metallic-champagne transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-metallic-champagne transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

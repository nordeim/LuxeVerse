"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

export function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Throttled scroll listener via rAF
  const ticking = useRef(false);

  const handleScroll = (): void => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking.current = false;
      });
      ticking.current = true;
    }
  };

  // Attach on mount via useEffect to avoid SSR issues
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navItems = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Editorial", href: "/editorial" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ease-luxe",
          isScrolled
            ? "bg-obsidian-50/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[var(--navbar-height)] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-display font-semibold tracking-tight text-obsidian-950"
            >
              LuxeVerse
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-obsidian-900 hover:text-neon-cyan transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="rounded-md p-2 text-obsidian-700 hover:bg-obsidian-100 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Cart"
              className="rounded-md p-2 text-obsidian-700 hover:bg-obsidian-100 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-lg bg-obsidian-950 px-4 py-2 text-sm font-medium text-metallic-champagne hover:bg-obsidian-900 transition-colors"
            >
              Sign In
            </Link>
            <button
              aria-label="Open menu"
              className="md:hidden rounded-md p-2 text-obsidian-700 hover:bg-obsidian-100 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[300] md:hidden">
          <div
            className="absolute inset-0 bg-obsidian-950/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-obsidian-50 shadow-dramatic p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-display font-semibold text-obsidian-950">
                Menu
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-obsidian-700 hover:bg-obsidian-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-obsidian-900 hover:text-neon-cyan transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

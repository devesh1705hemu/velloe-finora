"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Platform", href: "#platform" },
  { label: "Security", href: "#security" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/50 backdrop-blur-xs"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="#get-started">Login</Link>
          </Button>
          <Button
            size="sm"
            className="gap-1.5 shadow-sm group"
            asChild
          >
            <Link href="#get-started">
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-lg md:hidden animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full flex-col justify-between p-6">
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                <ShieldCheck className="h-4 w-4 text-growth" />
                <span>Zero-data-selling privacy architecture</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="#get-started">Login</Link>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="#get-started">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav
      className={cn("fixed top-6 left-0 right-0 z-50", "flex justify-center")}
    >
      <div
        className={cn(
          "glass-card rounded-full px-6 py-3",
          "flex items-center gap-12",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center gap-2 font-bold",
            "text-slate-900 dark:text-white tracking-wide",
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded bg-gradient-to-br",
              "from-cyan to-violet flex items-center",
              "justify-center text-white shadow-md",
              "shadow-cyan-500/20 dark:shadow-none",
            )}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          VetAI
        </div>

        {/* Links */}
        <div
          className={cn(
            "hidden md:flex gap-8 text-sm",
            "text-slate-500 dark:text-slate-400",
          )}
        >
          <Link
            href="#"
            className="hover:text-slate-900 dark:hover:text-white transition"
          >
            Features
          </Link>
          <Link
            href="#"
            className="hover:text-slate-900 dark:hover:text-white transition"
          >
            Accuracy
          </Link>
          <Link
            href="#"
            className="hover:text-slate-900 dark:hover:text-white transition"
          >
            Integration
          </Link>
        </div>

        {/* CTA */}
        <Button
          className={cn(
            "bg-slate-900 hover:bg-slate-800 text-white",
            "text-xs font-mono py-2 px-4 rounded-full",
            "transition uppercase tracking-wider shadow-lg",
            "shadow-slate-900/20 dark:bg-white/10",
            "dark:hover:bg-white/20 dark:border",
            "dark:border-white/10 dark:shadow-none",
          )}
        >
          Book Demo
        </Button>
      </div>
    </nav>
  );
};

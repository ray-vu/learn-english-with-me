"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PenLine, Sparkles } from "lucide-react";

const navItems = [
  { href: "/vocabulary", label: "Vocabulary", labelVi: "Từ vựng", icon: BookOpen },
  { href: "/writing", label: "Writing", labelVi: "Luyện viết", icon: PenLine },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="LearnEnglish home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm group-hover:shadow-indigo-200 group-hover:shadow-md transition-shadow duration-200">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">
            Learn<span className="text-indigo-600">English</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1" role="list">
            {navItems.map(({ href, label, labelVi, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150
                      ${active
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }
                    `}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{labelVi}</span>
                    {active && (
                      <span className="absolute inset-x-2 -bottom-px h-px bg-indigo-600 rounded-full" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

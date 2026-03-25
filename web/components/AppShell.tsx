"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { label: "Dashboard",   href: "/dashboard",   icon: "⊞" },
  { label: "Discover",    href: "/dashboard",   icon: "◎" },
  { label: "Messages",    href: "/messages",    icon: "◻" },
  { label: "Connections", href: "/connections", icon: "⌘" },
  { label: "Settings",    href: "/settings",    icon: "⊙" },
];

const MOBILE_NAV = [
  { label: "Home",        href: "/dashboard",   icon: "⊞" },
  { label: "Discover",    href: "/dashboard",   icon: "◎" },
  { label: "Chat",        href: "/messages",    icon: "◻" },
  { label: "Connections", href: "/connections", icon: "⌘" },
];

// Pages that should NOT show the app shell (auth / marketing)
const NO_SHELL_PREFIXES = ["/", "/login", "/register", "/onboarding"];

function isNoShellPath(path: string) {
  return NO_SHELL_PREFIXES.some((p) =>
    p === "/" ? path === "/" : path.startsWith(p)
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isNoShellPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#2d1f1a] py-6 px-4 gap-1">
        <div className="flex items-center gap-2 px-3 mb-8">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/profile")
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#e0a548]/10 text-[#e0a548] border border-[#e0a548]/20"
                  : "text-[#9a8870] hover:text-[#ede8d8] hover:bg-[#1a1208]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-[#9a8870] hover:text-red-400 hover:bg-red-400/5 mt-2"
        >
          <span className="text-base">↩</span>
          Sign out
        </button>

        <div className="mt-auto mx-1 bg-[#1a1208] border border-[#2d1f1a] rounded-xl p-4">
          <p className="text-[#9a8870] text-xs font-semibold tracking-wider uppercase mb-2">Tip</p>
          <p className="text-[#4a3828] text-xs leading-relaxed">
            Try opening with an AI starter from their profile to break the ice.
          </p>
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0d0a] border-t border-[#2d1f1a] flex z-50">
        {MOBILE_NAV.map((item) => {
          const isActive = item.href === "/messages"
            ? pathname.startsWith("/messages")
            : item.href === "/connections"
            ? pathname.startsWith("/connections")
            : pathname === "/dashboard";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? "text-[#e0a548]" : "text-[#9a8870] hover:text-[#e0a548]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Users,
  Wallet,
  Award,
  Package,
  Settings,
  Menu,
} from "lucide-react";

/**
 * Itens de navegação oficial conforme DESIGN.md Seção "Navegação":
 * Desktop: Início, Operação, Agenda, Clientes, Financeiro, Fidelidade, Estoque, Configurações
 * Mobile: Início, Operação, Agenda, Clientes, Mais
 */
const navItems = [
  { href: "/admin", label: "Início", icon: LayoutDashboard },
  { href: "/operacao", label: "Operação", icon: Wrench },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/fidelidade", label: "Fidelidade", icon: Award },
  { href: "/estoque", label: "Estoque", icon: Package },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors select-none",
              isActive
                ? "bg-brand-petrol text-white font-semibold shadow-xs"
                : "text-text-muted hover:text-text-main hover:bg-background"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileBottomNavigation() {
  const pathname = usePathname();

  // Itens prioritários mobile (DESIGN.md Seção "Navegação Mobile")
  const mobileItems = [
    { href: "/admin", label: "Início", icon: LayoutDashboard },
    { href: "/operacao", label: "Operação", icon: Wrench },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/configuracoes", label: "Mais", icon: Menu },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border-subtle h-[64px] px-2 flex items-center justify-around safe-area-bottom">
      {mobileItems.map((item) => {
        const isActive =
          item.label === "Mais"
            ? ["/financeiro", "/fidelidade", "/estoque", "/configuracoes"].some((path) =>
                pathname?.startsWith(path)
              )
            : pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors select-none",
              isActive
                ? "text-brand-action font-semibold"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <Icon className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5px]")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

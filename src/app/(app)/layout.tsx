import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { DesktopNavigation, MobileBottomNavigation } from "@/components/navigation/app-nav";
import { LogOut, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca perfil do usuário autenticado e nome da empresa
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, company_id, companies(name, trade_name)")
    .eq("id", user.id)
    .single();

  const companyName =
    (profile?.companies as unknown as { trade_name?: string; name?: string })?.trade_name ||
    (profile?.companies as unknown as { trade_name?: string; name?: string })?.name ||
    "Minha Empresa";

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="h-[60px] bg-surface border-b border-border-subtle sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-action inline-block group-hover:scale-125 transition-transform" />
            <span className="font-bold text-base tracking-tight text-text-main">
              e-potiguá
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-petrol bg-brand-petrol/10 px-2.5 py-1 rounded-[8px]">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[180px]">{companyName}</span>
          </div>

          {/* Navegação Desktop (DESIGN.md) */}
          <DesktopNavigation />
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-text-main leading-none">
              {profile?.full_name || user.email}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {profile?.role === "owner" ? "Proprietário" : profile?.role === "employee" ? "Operação" : "Cliente"}
            </p>
          </div>

          <form action={signOutAction}>
            <Button
              variant="ghost"
              size="compact"
              className="text-text-muted hover:text-status-error gap-1 px-2.5"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Sair</span>
            </Button>
          </form>
        </div>
      </header>

      {/* Main App Content - com padding inferior para a barra mobile */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-[80px] lg:pb-8">
        {children}
      </main>

      {/* Navegação Inferior Mobile (DESIGN.md Seção "Navegação Mobile") */}
      <MobileBottomNavigation />
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut, Building2, User } from "lucide-react";

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

  // Busca dados do perfil e da empresa vinculada
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, company_id, companies(name, trade_name)")
    .eq("id", user.id)
    .single();

  const companyName =
    (profile?.companies as unknown as { trade_name?: string; name?: string })?.trade_name ||
    (profile?.companies as unknown as { trade_name?: string; name?: string })?.name ||
    "Empresa";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="h-[60px] bg-surface border-b border-border-subtle sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-action inline-block group-hover:scale-125 transition-transform" />
            <span className="font-bold text-base tracking-tight text-text-main">
              e-potiguá
            </span>
          </Link>
          <span className="text-border-subtle">|</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-petrol bg-brand-petrol/10 px-2.5 py-1 rounded-[8px]">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[160px] sm:max-w-xs">{companyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
            <User className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-medium text-text-main">{profile?.full_name || user.email}</span>
            <span className="capitalize px-1.5 py-0.5 rounded text-[10px] bg-background border border-border-subtle">
              {profile?.role === "owner" ? "Proprietário" : profile?.role === "employee" ? "Funcionário" : "Cliente"}
            </span>
          </div>

          <form action={signOutAction}>
            <Button variant="ghost" size="compact" className="text-text-muted hover:text-status-error gap-1">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </form>
        </div>
      </header>

      {/* Main App Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}

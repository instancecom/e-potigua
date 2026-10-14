import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Store, Users, DollarSign, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Busca dados da empresa e contagem de unidades/funcionários
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user?.id || "")
    .single();

  const companyId = profile?.company_id;

  const [{ count: unitsCount }, { count: employeesCount }, { count: servicesCount }] = await Promise.all([
    supabase.from("units").select("*", { count: "exact", head: true }).eq("company_id", companyId || ""),
    supabase.from("employees").select("*", { count: "exact", head: true }).eq("company_id", companyId || ""),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("company_id", companyId || ""),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Painel de Gestão
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Visão consolidada da sua empresa, unidades e operação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/operacao">
            <Button variant="secondary" size="compact" type="button">
              <span>Modo Operação</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <Button variant="primary" size="compact">
            <Plus className="w-4 h-4 mr-1" />
            <span>Novo Atendimento</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-muted">Unidades Físicas</CardTitle>
            <Store className="w-4 h-4 text-brand-petrol" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-main">{unitsCount || 1}</div>
            <p className="text-xs text-text-muted mt-1">Locais operacionais ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-muted">Funcionários</CardTitle>
            <Users className="w-4 h-4 text-brand-action" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-main">{employeesCount || 0}</div>
            <p className="text-xs text-text-muted mt-1">Lavadores e atendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-muted">Serviços Ativos</CardTitle>
            <Building2 className="w-4 h-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-main">{servicesCount || 0}</div>
            <p className="text-xs text-text-muted mt-1">Tabela de preços cadastrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-text-muted">Faturamento Hoje</CardTitle>
            <DollarSign className="w-4 h-4 text-status-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-main">R$ 0,00</div>
            <p className="text-xs text-text-muted mt-1">0 atendimentos concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Primeiros Passos do Seu SaaS</CardTitle>
          <CardDescription>
            Sua empresa já está configurada com isolamento multiempresa e RLS ativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[12px] bg-background border border-border-subtle space-y-2">
              <p className="text-xs font-bold text-brand-petrol uppercase tracking-wider">1. Serviços</p>
              <h4 className="text-sm font-semibold text-text-main">Cadastrar Serviços & Preços</h4>
              <p className="text-xs text-text-muted">Configure preços diferenciados para hatch, sedan, SUV e motos.</p>
            </div>
            <div className="p-4 rounded-[12px] bg-background border border-border-subtle space-y-2">
              <p className="text-xs font-bold text-brand-petrol uppercase tracking-wider">2. Equipe</p>
              <h4 className="text-sm font-semibold text-text-main">Cadastrar Funcionários</h4>
              <p className="text-xs text-text-muted">Adicione lavadores para cálculo de capacidade operacional.</p>
            </div>
            <div className="p-4 rounded-[12px] bg-background border border-border-subtle space-y-2">
              <p className="text-xs font-bold text-brand-petrol uppercase tracking-wider">3. Fidelidade</p>
              <h4 className="text-sm font-semibold text-text-main">Configurar Recompensa</h4>
              <p className="text-xs text-text-muted">Defina o prêmio que os clientes ganham ao acumular 8 carimbos.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

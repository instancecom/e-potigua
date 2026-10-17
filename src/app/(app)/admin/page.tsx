import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { OperationStatusBadge } from "@/components/ui/badge";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  AlertCircle,
  PackageCheck,
  Wrench,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user?.id || "")
    .single();

  const companyId = profile?.company_id;

  // Consultas reais para o resumo vivo da operação (DESIGN.md Seção "Dashboard")
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: activeAttendances },
    { data: financialData },
    { data: replenishmentRequests },
    { data: activeUnits },
  ] = await Promise.all([
    supabase
      .from("attendances")
      .select("id, status, total_price, vehicles(license_plate, model, type)")
      .eq("company_id", companyId || "")
      .neq("status", "finalizado"),
    supabase
      .from("financial_transactions")
      .select("type, amount")
      .eq("company_id", companyId || "")
      .gte("occurred_at", `${today}T00:00:00Z`),
    supabase
      .from("inventory_replenishment_requests")
      .select("id, item_name, status, requested_by_user_id")
      .eq("company_id", companyId || "")
      .eq("status", "pending"),
    supabase
      .from("units")
      .select("id, name, active_washers_count")
      .eq("company_id", companyId || "")
      .eq("is_active", true),
  ]);

  // Cálculos financeiros do dia (DESIGN.md Seção "Financeiro")
  const totalIncome = (financialData || [])
    .filter((tx) => tx.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = (financialData || [])
    .filter((tx) => tx.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Contagem do Pátio Vivo
  const queueCount = (activeAttendances || []).filter((a) => a.status === "na_fila").length;
  const washingCount = (activeAttendances || []).filter((a) => a.status === "lavando").length;
  const dryingCount = (activeAttendances || []).filter((a) => a.status === "secando").length;
  const totalInYard = (activeAttendances || []).length;

  const pendingRequestsCount = (replenishmentRequests || []).length;
  const totalWashers = (activeUnits || []).reduce((acc, u) => acc + (u.active_washers_count || 0), 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Header com Saldo do Dia (Estilo Banco Digital - DESIGN.md) & Ação Principal */}
      <section className="bg-surface rounded-[16px] border border-border-subtle p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            <span>Faturamento Hoje</span>
            <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" />
            <span className="text-[11px] font-normal lowercase">tempo real</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main">
              {formatCurrency(totalIncome)}
            </span>
          </div>

          {/* Entradas e Saídas discretas */}
          <div className="flex items-center gap-4 pt-1 text-xs font-medium">
            <span className="flex items-center gap-1 text-status-success">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Entradas: {formatCurrency(totalIncome)}
            </span>
            <span className="text-border-subtle">|</span>
            <span className="flex items-center gap-1 text-status-error">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Saídas: {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>

        {/* Ação Principal da Tela (DESIGN.md Seção "Ações") */}
        <div className="flex items-center gap-3">
          <Link href="/operacao" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="large"
              className="w-full sm:w-auto text-sm font-semibold shadow-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Atendimento</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Resumo Vivo da Operação no Pátio (DESIGN.md Seção "Dashboard") */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-brand-petrol" />
            <h2 className="text-base font-bold text-text-main">Pátio Agora</h2>
            <span className="text-xs font-semibold text-text-muted bg-surface px-2 py-0.5 rounded-[6px] border border-border-subtle">
              {totalInYard} {totalInYard === 1 ? "veículo" : "veículos"}
            </span>
          </div>

          <Link
            href="/operacao"
            className="text-xs font-semibold text-brand-action hover:underline inline-flex items-center gap-1"
          >
            Abrir Operação
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Status da Operação em Cartões Táteis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Na Fila */}
          <Link
            href="/operacao"
            className="p-5 rounded-[12px] bg-surface border border-border-subtle hover:border-status-warning/50 transition-colors group flex items-center justify-between"
          >
            <div className="space-y-1">
              <OperationStatusBadge status="na_fila" />
              <p className="text-xs text-text-muted">Aguardando lavador assumir</p>
            </div>
            <span className="text-2xl font-bold text-text-main group-hover:text-status-warning transition-colors">
              {queueCount}
            </span>
          </Link>

          {/* Lavando */}
          <Link
            href="/operacao"
            className="p-5 rounded-[12px] bg-surface border border-border-subtle hover:border-brand-action/50 transition-colors group flex items-center justify-between"
          >
            <div className="space-y-1">
              <OperationStatusBadge status="lavando" />
              <p className="text-xs text-text-muted">Veículos na rampa / box</p>
            </div>
            <span className="text-2xl font-bold text-text-main group-hover:text-brand-action transition-colors">
              {washingCount}
            </span>
          </Link>

          {/* Secando */}
          <Link
            href="/operacao"
            className="p-5 rounded-[12px] bg-surface border border-border-subtle hover:border-brand-petrol/50 transition-colors group flex items-center justify-between"
          >
            <div className="space-y-1">
              <OperationStatusBadge status="secando" />
              <p className="text-xs text-text-muted">Acabamento e aspiração</p>
            </div>
            <span className="text-2xl font-bold text-text-main group-hover:text-brand-petrol transition-colors">
              {dryingCount}
            </span>
          </Link>
        </div>
      </section>

      {/* 3. Alertas e Atenção Operacional (DESIGN.md: "Existem problemas que precisam de atenção?") */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solicitações de Estoque */}
        <div className="p-5 rounded-[12px] bg-surface border border-border-subtle flex items-start gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-background border border-border-subtle flex items-center justify-center shrink-0 mt-0.5">
            <PackageCheck className="w-4 h-4 text-text-muted" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-main">Insumos & Reposição</h3>
              {pendingRequestsCount > 0 ? (
                <span className="text-[11px] font-bold text-status-warning bg-status-warning/10 px-2 py-0.5 rounded-[6px]">
                  {pendingRequestsCount} pendente(s)
                </span>
              ) : (
                <span className="text-[11px] font-medium text-status-success">Estoque em dia</span>
              )}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {pendingRequestsCount > 0
                ? "Há solicitações de produtos enviadas pelos lavadores aguardando liberação."
                : "Nenhuma solicitação de reposição urgente da equipe."}
            </p>
            <div className="pt-2">
              <Link
                href="/estoque"
                className="text-xs font-semibold text-brand-petrol hover:underline"
              >
                Gerenciar Estoque &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Capacidade Operacional da Equipe */}
        <div className="p-5 rounded-[12px] bg-surface border border-border-subtle flex items-start gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-background border border-border-subtle flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4 text-text-muted" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-main">Capacidade da Unidade</h3>
              <span className="text-[11px] font-bold text-brand-petrol bg-brand-petrol/10 px-2 py-0.5 rounded-[6px]">
                {totalWashers} lavador(es) ativo(s)
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              A capacidade de agendamentos e atendimento simultâneo considera a equipe em turno.
            </p>
            <div className="pt-2">
              <Link
                href="/configuracoes"
                className="text-xs font-semibold text-brand-petrol hover:underline"
              >
                Gerenciar Equipe & Unidades &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

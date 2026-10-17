import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function FinanceiroPage() {
  const supabase = await createClient();

  // Busca transações financeiras da empresa
  const { data: transactions } = await supabase
    .from("financial_transactions")
    .select("*")
    .order("occurred_at", { ascending: false });

  const totalIncome = transactions
    ?.filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpense = transactions
    ?.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Financeiro</h1>

      {/* Cards de Resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-text-muted">Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-status-success">R$ {totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-text-muted">Saídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-status-error">R$ {totalExpense.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-text-muted">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-brand-action" : "text-status-error"}`}>
              R$ {netBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Movimentações */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Últimas Movimentações</h2>
        <div className="grid gap-2">
          {transactions?.map((tx) => (
            <Card key={tx.id} className="border-border-subtle">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-text-main">{tx.description}</p>
                  <p className="text-xs text-text-muted">
                    {format(new Date(tx.occurred_at), "dd/MM/yyyy - HH:mm", { locale: ptBR })} • {tx.payment_method || "Manual"}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "income" ? "text-status-success" : "text-status-error"}`}>
                    {tx.type === "income" ? "+" : "-"} R$ {Number(tx.amount).toFixed(2)}
                  </p>
                  <Badge variant={tx.type === "income" ? "success" : "error"}>{tx.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!transactions || transactions.length === 0) && (
            <div className="text-center py-10 text-text-muted text-sm">
              Nenhuma movimentação financeira registrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

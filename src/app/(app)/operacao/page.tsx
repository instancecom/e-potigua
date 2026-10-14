import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OperationStatusBadge } from "@/components/ui/badge";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OperationPage() {
  const columns = [
    { id: "na_fila", title: "Na Fila", count: 0, status: "na_fila" as const },
    { id: "lavando", title: "Lavando", count: 0, status: "lavando" as const },
    { id: "secando", title: "Secando", count: 0, status: "secando" as const },
    { id: "finalizado", title: "Finalizado", count: 0, status: "finalizado" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-medium text-text-muted hover:text-brand-action inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Painel de Gestão
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">
            Operação de Pátio
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Fluxo ágil em 4 etapas para lavadores e atendentes.
          </p>
        </div>

        <Button variant="primary" size="default" className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Iniciar Atendimento</span>
        </Button>
      </div>

      {/* 4 Status Columns (Mobile first / Scroll horizontal em telas pequenas) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col rounded-[12px] bg-background border border-border-subtle p-3 min-h-[360px]"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <OperationStatusBadge status={col.status} />
              </div>
              <span className="text-xs font-bold text-text-muted bg-surface px-2 py-0.5 rounded-[6px] border border-border-subtle">
                {col.count}
              </span>
            </div>

            {/* Empty State da Coluna */}
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle/80 rounded-[8px] p-4 text-center">
              <p className="text-xs font-medium text-text-muted">
                Nenhum veículo {col.title.toLowerCase()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

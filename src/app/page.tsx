import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OperationStatusBadge } from "@/components/ui/badge";
import { ShieldCheck, Building2, Wrench, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-4xl space-y-8">
        {/* Header institucional */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-action inline-block" />
              <h1 className="text-2xl font-bold tracking-tight text-text-main">
                e-potiguá
              </h1>
            </div>
            <p className="text-sm text-text-muted">
              Plataforma de gestão e operação para estética automotiva & lava-rápidos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="compact">
              Documentação
            </Button>
            <Button variant="petrol" size="compact">
              Acesso Gestão
            </Button>
          </div>
        </header>

        {/* Grade de Contexto Visual & Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <CardHeader>
              <div className="w-9 h-9 rounded-[8px] bg-brand-petrol/10 text-brand-petrol flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle>Gestão Multiempresa</CardTitle>
              <CardDescription>
                Isolamento lógico estrito por empresa e unidades desde o dia zero.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-9 h-9 rounded-[8px] bg-brand-action/10 text-brand-action flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5" />
              </div>
              <CardTitle>Operação Ágil</CardTitle>
              <CardDescription>
                Mobile-first com poucos cliques para atualização rápida de status.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-9 h-9 rounded-[8px] bg-status-success/10 text-status-success flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle>Segurança no Backend</CardTitle>
              <CardDescription>
                Autorização mandatória no servidor e RLS no PostgreSQL.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demonstração de Componentes do Design System */}
        <Card className="border-border-subtle bg-surface">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-petrol" />
              Validação dos Design Tokens (DESIGN.md)
            </CardTitle>
            <CardDescription>
              Fluxo operacional em 4 etapas e hierarquia visual inspirada em bancos digitais modernos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status operacionais */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Status do Atendimento
              </p>
              <div className="flex flex-wrap gap-2.5">
                <OperationStatusBadge status="na_fila" />
                <OperationStatusBadge status="lavando" />
                <OperationStatusBadge status="secando" />
                <OperationStatusBadge status="finalizado" />
              </div>
            </div>

            {/* Ações e botões */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Botões e Ações Padrão
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Ação Principal (44px)</Button>
                <Button variant="petrol">Institucional Petróleo</Button>
                <Button variant="secondary">Secundário</Button>
                <Button variant="danger" size="compact">Perigo (36px)</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

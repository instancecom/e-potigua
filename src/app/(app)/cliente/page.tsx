import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Car, Calendar, Plus } from "lucide-react";

export default function CustomerPortalPage() {
  const stamps = Array.from({ length: 8 }, (_, i) => i < 3); // Simulação de 3 carimbos

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">
          Minha Área
        </h1>
        <p className="text-sm text-text-muted mt-0.5">
          Acompanhe seus serviços, veículos e seu cartão de fidelidade.
        </p>
      </div>

      {/* Cartão de Fidelidade Digital (8 Carimbos - PRODUCT.md Seção 18) */}
      <Card className="border-brand-petrol/30 bg-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-petrol" />
              <CardTitle className="text-base">Cartão Fidelidade Digital</CardTitle>
            </div>
            <span className="text-xs font-bold text-brand-petrol bg-brand-petrol/10 px-2.5 py-1 rounded-[8px]">
              3 de 8 carimbos
            </span>
          </div>
          <CardDescription>
            Complete os 8 carimbos para resgatar sua recompensa: <strong>1 Lavagem Completa Grátis</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {stamps.map((isStamped, index) => (
              <div
                key={index}
                className={`h-12 rounded-[10px] flex flex-col items-center justify-center border transition-all ${
                  isStamped
                    ? "bg-brand-action/10 border-brand-action text-brand-action font-bold"
                    : "bg-background border-border-subtle text-text-muted/60"
                }`}
              >
                <span className="text-xs">{index + 1}</span>
                {isStamped && <span className="text-[10px]">★</span>}
              </div>
            ))}
          </div>

          <Button variant="secondary" className="w-full text-xs" disabled>
            Resgatar Recompensa (disponível com 8 carimbos)
          </Button>
        </CardContent>
      </Card>

      {/* Veículos Cadastrados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="w-4 h-4 text-brand-action" />
              Meus Veículos
            </CardTitle>
            <CardDescription>Veículos associados à sua conta.</CardDescription>
          </div>
          <Button variant="secondary" size="compact">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-[8px] bg-background border border-dashed border-border-subtle text-center">
            <p className="text-xs text-text-muted">Nenhum veículo cadastrado ainda.</p>
          </div>
        </CardContent>
      </Card>

      {/* Agendamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-petrol" />
              Meus Agendamentos
            </CardTitle>
            <CardDescription>Horários marcados nas unidades.</CardDescription>
          </div>
          <Button variant="primary" size="compact">
            Agendar Horário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-[8px] bg-background border border-dashed border-border-subtle text-center">
            <p className="text-xs text-text-muted">Você não possui agendamentos futuros.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

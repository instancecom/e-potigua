"use client";

import { useActionState, useState } from "react";
import { createServiceAction } from "@/features/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VEHICLE_TYPES = [
  { id: "hatch", label: "Hatch" },
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
  { id: "pickup", label: "Caminhonete/Pickup" },
  { id: "truck", label: "Caminhão" },
  { id: "motorcycle", label: "Moto" },
];

export default function ServicesPage() {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);
  
  // Estado para controlar os preços e durações de cada categoria
  const [prices, setPrices] = useState<Record<string, { price: string; duration: string }>>(
    VEHICLE_TYPES.reduce((acc, type) => ({
      ...acc,
      [type.id]: { price: "", duration: "" }
    }), {})
  );

  const handlePriceChange = (typeId: string, field: "price" | "duration", value: string) => {
    setPrices(prev => ({
      ...prev,
      [typeId]: { ...prev[typeId], [field]: value }
    }));
  };

  // Prepara o JSON para o campo hidden que a Action espera
  const pricesPayload = JSON.stringify(
    Object.entries(prices)
      .filter(([_, data]) => data.price !== "" && data.duration !== "")
      .map(([typeId, data]) => ({
        vehicleType: typeId,
        price: Number(data.price),
        estimatedDurationMinutes: Number(data.duration)
      }))
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <Card className="border-border-subtle shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-brand-petrol">Novo Serviço</CardTitle>
          <p className="text-sm text-text-muted">Configure o nome e os valores por categoria de veículo.</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-8">
            {/* Dados Básicos */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Nome do Serviço" placeholder="Ex: Lavagem Completa" required />
              <Input name="description" label="Descrição (Opcional)" placeholder="Ex: Lavagem externa + interna" />
            </div>

            {/* Tabela de Preços */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Preços por Categoria</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {VEHICLE_TYPES.map((type) => (
                  <Card key={type.id} className="p-4 bg-surface border-border-subtle">
                    <div className="text-sm font-bold mb-3 text-text-main">{type.label}</div>
                    <div className="grid gap-2">
                      <Input 
                        type="number" 
                        placeholder="Preço (R$)" 
                        value={prices[type.id].price}
                        onChange={(e) => handlePriceChange(type.id, "price", e.target.value)}
                      />
                      <Input 
                        type="number" 
                        placeholder="Tempo (min)" 
                        value={prices[type.id].duration}
                        onChange={(e) => handlePriceChange(type.id, "duration", e.target.value)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Campo Hidden com o payload estruturado */}
            <input type="hidden" name="prices" value={pricesPayload} />
            
            {state?.error && (
              <div className="p-3 rounded-[8px] bg-status-error/10 text-status-error text-xs font-medium border border-status-error/20">
                {state.error}
              </div>
            )}
            {state?.message && (
              <div className="p-3 rounded-[8px] bg-status-success/10 text-status-success text-xs font-medium border border-status-success/20">
                {state.message}
              </div>
            )}

            <div className="pt-4 border-t border-border-subtle flex justify-end">
              <Button type="submit" variant="primary" className="w-full sm:w-auto" isLoading={isPending}>
                Salvar Serviço
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

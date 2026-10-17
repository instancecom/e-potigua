"use client";

import { useActionState } from "react";
import { createServiceAction } from "@/features/services/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vehicleTypeEnum } from "@/features/services/schemas";

export default function ServicesPage() {
  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // Exemplo de payload: JSON stringified de um array de preços
  // Em uma UI real, usaríamos um gerenciador de form dinâmico
  const defaultPrices = JSON.stringify([
    { vehicleType: "hatch", price: 50, estimatedDurationMinutes: 40 },
    { vehicleType: "suv", price: 70, estimatedDurationMinutes: 60 }
  ]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Novo Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="prices" value={defaultPrices} />
            
            <Input name="name" label="Nome do Serviço" placeholder="Ex: Lavagem Completa" required />
            <Input name="description" label="Descrição" placeholder="Opcional" />
            
            {state?.error && <p className="text-status-error text-sm">{state.error}</p>}
            {state?.message && <p className="text-status-success text-sm">{state.message}</p>}

            <Button type="submit" isLoading={isPending}>Salvar Serviço</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

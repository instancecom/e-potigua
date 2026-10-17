"use client";

import { useActionState, useState } from "react";
import { createAttendanceAction } from "@/features/operations/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default function NovoAtendimentoAdminPage() {
  const [state, formAction, isPending] = useActionState(createAttendanceAction, null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega dados iniciais
  // TODO: mover para Server Component e passar como props
  // Por enquanto mock para validar fluxo
  setLoading(false);

  return (
    <div className="max-w-lg mx-auto p-4 pb-20">
      <h1 className="text-xl font-bold mb-6 text-brand-petrol">Novo Atendimento (Walk-in)</h1>
      
      {loading ? (
        <p className="text-center py-10 text-text-muted">Carregando...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <Input name="licensePlate" label="Placa do Veículo" placeholder="ABC-1234" required />
              <Input name="vehicleModel" label="Modelo" placeholder="Fiat Uno" />
              <Input name="vehicleType" label="Tipo" placeholder="hatch / sedan / suv / pickup / truck / motorcycle" />
              
              {state?.error && <p className="text-status-error text-sm">{state.error}</p>}
              {state?.message && <p className="text-status-success text-sm">{state.message}</p>}

              <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
                Iniciar Atendimento
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
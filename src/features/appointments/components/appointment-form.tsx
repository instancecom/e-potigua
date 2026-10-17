"use client";

import { useActionState, useState, useEffect } from "react";
import { createAppointmentAction } from "@/features/appointments/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AppointmentFormProps {
  vehicles: any[];
  services: any[];
  unitId: string;
}

export function AppointmentForm({ vehicles, services, unitId }: AppointmentFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createAppointmentAction, null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (state?.success) {
      router.push("/agenda");
      router.refresh();
    }
  }, [state, router]);

  const selectedServiceDetails = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedServiceDetails.reduce((sum, s) => sum + (s.prices[0]?.price || 0), 0);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="unitId" value={unitId} />
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Veículo</label>
          <select name="vehicleId" className="w-full p-3 rounded-[12px] border border-border-subtle bg-background" required>
            <option value="">Selecione um veículo</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.license_plate} - {v.model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Data e Hora</label>
          <Input name="scheduledAt" type="datetime-local" required />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Serviços</label>
          <div className="grid gap-2">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-3 p-3 border border-border-subtle rounded-[12px] cursor-pointer hover:bg-surface">
                <input 
                  type="checkbox" 
                  name="serviceIds" 
                  value={s.id} 
                  checked={selectedServices.includes(s.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedServices([...selectedServices, s.id]);
                    else setSelectedServices(selectedServices.filter(id => id !== s.id));
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{s.name}</span>
                <span className="ml-auto text-sm font-bold text-brand-petrol">R$ {s.prices[0]?.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        <Input name="notes" label="Observações" placeholder="Ex: Chave na recepção" />
      </div>

      <div className="pt-4 border-t border-border-subtle">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-text-muted">Total Estimado</span>
          <span className="text-lg font-bold text-brand-petrol">R$ {totalPrice.toFixed(2)}</span>
        </div>
        
        {state?.error && <p className="text-status-error text-sm mb-4">{state.error}</p>}
        
        <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
          Confirmar Agendamento
        </Button>
      </div>
    </form>
  );
}

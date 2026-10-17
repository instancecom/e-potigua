"use client";

import { startAttendanceFromAppointment } from "@/features/appointments/actions-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Play } from "lucide-react";

export function AppointmentList({ appointments }: { appointments: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStart = async (id: string) => {
    setLoadingId(id);
    await startAttendanceFromAppointment(id);
    setLoadingId(null);
  };

  return (
    <div className="grid gap-4">
      {appointments.map((app) => {
        const vehicle = Array.isArray(app.vehicle) ? app.vehicle[0] : app.vehicle;
        const canStart = app.status === "scheduled" || app.status === "confirmed";

        return (
          <Card key={app.id} className="border-border-subtle">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-main">
                  {format(new Date(app.scheduled_at), "dd/MM - HH:mm", { locale: ptBR })}
                </p>
                <p className="text-xs text-text-muted">
                  {vehicle?.license_plate} • {vehicle?.model}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {app.items?.map((item: any, i: number) => (
                    <Badge key={i} variant="outline" className="text-[10px]">{item.service_name}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-petrol">R$ {Number(app.total_price).toFixed(2)}</p>
                  <Badge variant={app.status === "scheduled" ? "warning" : "default"}>{app.status}</Badge>
                </div>
                {canStart && (
                  <Button 
                    size="compact" 
                    variant="primary" 
                    onClick={() => handleStart(app.id)}
                    isLoading={loadingId === app.id}
                  >
                    <Play className="w-3 h-3 mr-1" /> Iniciar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

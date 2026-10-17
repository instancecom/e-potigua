import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AgendaPage() {
  const supabase = await createClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      scheduled_at,
      total_price,
      status,
      vehicle:vehicles(license_plate, model),
      items:appointment_items(service_name)
    `)
    .order("scheduled_at", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Agenda</h1>
      
      <div className="grid gap-4">
        {appointments?.map((app: any) => {
          const vehicle = Array.isArray(app.vehicle) ? app.vehicle[0] : app.vehicle;
          return (
            <Card key={app.id} className="border-border-subtle">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-text-main">
                    {format(new Date(app.scheduled_at), "dd/MM - HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-text-muted">
                    {vehicle?.license_plate} • {vehicle?.model}
                  </p>
                  <div className="mt-2 flex gap-1 flex-wrap">
                      {app.items?.map((item: any, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{item.service_name}</Badge>
                      ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-petrol">R$ {Number(app.total_price).toFixed(2)}</p>
                  <Badge variant={app.status === "scheduled" ? "action" : "default"}>{app.status}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!appointments || appointments.length === 0) && (
          <div className="text-center py-10 text-text-muted text-sm">
            Nenhum agendamento futuro encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { AttendanceCard } from "@/components/operation/attendance-card";
import { redirect } from "next/navigation";
import { Attendance } from "@/features/operations/types";
import { startAttendanceFromAppointment } from "@/features/appointments/actions-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Play } from "lucide-react";

export default async function OperacaoPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "employee" && profile.role !== "owner")) {
    redirect("/login");
  }

  // Busca unidade ativa
  const { data: employee } = await supabase
    .from("employees")
    .select("active_unit_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let unitId = employee?.active_unit_id;

  if (!unitId && profile.company_id) {
    const { data: firstUnit } = await supabase
      .from("units")
      .select("id")
      .eq("company_id", profile.company_id)
      .eq("is_active", true)
      .limit(1)
      .single();
    unitId = firstUnit?.id;
  }

  if (!unitId) redirect("/admin");

  // 1. Carrega agendamentos pendentes (scheduled / confirmed) para esta unidade
  const { data: scheduledAppointments } = await supabase
    .from("appointments")
    .select(`
      id,
      scheduled_at,
      total_price,
      status,
      vehicle:vehicles(license_plate, model),
      items:appointment_items(service_name)
    `)
    .eq("unit_id", unitId)
    .in("status", ["scheduled", "confirmed"])
    .order("scheduled_at", { ascending: true });

  // 2. Carrega atendimentos em andamento no pátio
  const { data: attendances } = await supabase
    .from("attendances")
    .select(`
      *,
      items:attendance_items(*)
    `)
    .eq("unit_id", unitId)
    .neq("status", "finalizado")
    .order("started_at", { ascending: true });

  const typedAttendances = (attendances || []) as unknown as Attendance[];

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-petrol">Operação do Pátio</h1>
      </div>

      {/* Seção 1: Agendamentos Aguardando Chegada (Check-in rápido) */}
      {scheduledAppointments && scheduledAppointments.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Chegadas Esperadas ({scheduledAppointments.length})
          </h2>
          <div className="grid gap-3">
            {scheduledAppointments.map((app: any) => {
              const vehicle = Array.isArray(app.vehicle) ? app.vehicle[0] : app.vehicle;
              return (
                <Card key={app.id} className="border-border-subtle bg-surface">
                  <CardContent className="p-3.5 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-text-main">
                        {format(new Date(app.scheduled_at), "HH:mm", { locale: ptBR })} • {vehicle?.license_plate} ({vehicle?.model})
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {app.items?.map((item: any) => item.service_name).join(", ")}
                      </p>
                    </div>
                    <form action={async () => {
                      "use server";
                      await startAttendanceFromAppointment(app.id);
                    }}>
                      <Button size="compact" variant="primary">
                        <Play className="w-3 h-3 mr-1" /> Check-in
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Seção 2: Pátio em Andamento */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Veículos no Pátio ({typedAttendances.length})
        </h2>
        <div className="grid gap-4">
          {typedAttendances.map((att) => (
            <AttendanceCard 
              key={att.id} 
              attendance={att} 
              unitId={unitId} 
            />
          ))}
          {typedAttendances.length === 0 && (
            <Card className="p-8 text-center border-border-subtle">
              <p className="text-text-muted text-sm">Nenhum veículo em andamento no pátio no momento.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

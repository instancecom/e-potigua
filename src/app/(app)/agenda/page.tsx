import { createClient } from "@/lib/supabase/server";
import { AppointmentList } from "@/features/appointments/components/appointment-list";

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
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Agenda</h1>
      </div>
      
      <AppointmentList appointments={appointments || []} />

      {(!appointments || appointments.length === 0) && (
        <div className="text-center py-10 text-text-muted text-sm">
          Nenhum agendamento futuro encontrado.
        </div>
      )}
    </div>
  );
}

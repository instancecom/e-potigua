import { createClient } from "@/lib/supabase/server";
import { AppointmentForm } from "@/features/appointments/components/appointment-form";
import { redirect } from "next/navigation";

export default async function NovoAgendamentoPage() {
  const supabase = await createClient();

  // 1. Contexto do usuário
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Busca dados necessários (Veículos e Serviços da Empresa)
  const [
    { data: vehicles },
    { data: services }
  ] = await Promise.all([
    supabase.from("vehicles").select("id, license_plate, model"),
    supabase.from("services").select("id, name, prices:service_prices(price, vehicle_type)")
  ]);

  // 3. Unidade da empresa (pega a primeira por simplicidade na V1)
  const { data: units } = await supabase.from("units").select("id").limit(1).single();

  return (
    <div className="max-w-lg mx-auto p-4 pb-20">
      <h1 className="text-xl font-bold mb-6 text-brand-petrol">Novo Agendamento</h1>
      <AppointmentForm 
        vehicles={vehicles || []} 
        services={services || []} 
        unitId={units?.id || ""} 
      />
    </div>
  );
}

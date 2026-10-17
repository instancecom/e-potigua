import { createClient } from "@/lib/supabase/server";
import { AttendanceCard } from "@/components/operation/attendance-card";
import { redirect } from "next/navigation";

export default async function OperacaoPage() {
  const supabase = await createClient();

  // Verifica sessão e unidade ativa do funcionário
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: employee } = await supabase
    .from("employees")
    .select("active_unit_id")
    .eq("user_id", user.id)
    .single();

  if (!employee) redirect("/login");

  // Carrega atendimentos na fila/operação (exceto finalizados que podem ter aba específica)
  const { data: attendances } = await supabase
    .from("attendances")
    .select(`
      *,
      items:attendance_items(*)
    `)
    .eq("unit_id", employee.active_unit_id)
    .neq("status", "finalizado")
    .order("started_at", { ascending: true });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Operação - Unidade {employee.active_unit_id}</h1>
      <div className="grid gap-4">
        {attendances?.map((att) => (
          <AttendanceCard 
            key={att.id} 
            attendance={att as any} 
            unitId={employee.active_unit_id} 
          />
        ))}
        {(!attendances || attendances.length === 0) && (
          <p className="text-gray-500 text-center py-10">Nenhum veículo em operação.</p>
        )}
      </div>
    </div>
  );
}

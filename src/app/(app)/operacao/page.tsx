import { createClient } from "@/lib/supabase/server";
import { AttendanceCard } from "@/components/operation/attendance-card";
import { redirect } from "next/navigation";
import { Attendance } from "@/features/operations/types";

export default async function OperacaoPage() {
  const supabase = await createClient();

  // Verifica sessão e unidade ativa do funcionário
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

  // Busca a unidade ativa (se funcionário) ou a primeira unidade (se dono)
  const { data: unitData } = await supabase
    .from("employees")
    .select("active_unit_id")
    .eq("user_id", user.id)
    .single();

  let unitId = unitData?.active_unit_id;

  if (!unitId) {
    const { data: firstUnit } = await supabase
      .from("units")
      .select("id")
      .eq("company_id", profile.company_id)
      .limit(1)
      .single();
    unitId = firstUnit?.id;
  }

  if (!unitId) redirect("/admin");

  // Carrega atendimentos
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
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Operação - Unidade {unitId}</h1>
      <div className="grid gap-4">
        {typedAttendances.map((att) => (
          <AttendanceCard 
            key={att.id} 
            attendance={att} 
            unitId={unitId} 
          />
        ))}
        {typedAttendances.length === 0 && (
          <p className="text-gray-500 text-center py-10">Nenhum veículo em operação.</p>
        )}
      </div>
    </div>
  );
}

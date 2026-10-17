"use server";

import { AttendanceOperationalStatus } from "./types";

import { createClient } from "@/lib/supabase/server";

export async function updateAttendanceStatus(
  attendanceId: string,
  newStatus: AttendanceOperationalStatus,
  unitId: string
) {
  const supabase = await createClient();

  // Autorização garantida por RLS no banco via Policy
  // Valida que o usuário tem acesso à empresa e unidade
  const { data, error } = await supabase
    .from("attendances")
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString(),
      completed_at: newStatus === "finalizado" ? new Date().toISOString() : null
    })
    .eq("id", attendanceId)
    .eq("unit_id", unitId)
    .select()
    .single();

  if (error) throw new Error("Erro ao atualizar status da operação.");
  return data;
}

export async function addServiceToAttendance(
  attendanceId: string,
  serviceId: string,
  price: number,
  unitId: string
) {
  const supabase = await createClient();

  // Iniciar transação para atualizar valor do atendimento e inserir item
  const { error } = await supabase.rpc("add_attendance_service", {
    p_attendance_id: attendanceId,
    p_service_id: serviceId,
    p_price: price,
    p_unit_id: unitId
  });

  if (error) throw new Error("Erro ao adicionar serviço.");
  return { success: true };
}

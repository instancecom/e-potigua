"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Converte um agendamento confirmado em um atendimento operacional.
 * Segue o fluxo: Agendamento → Atendimento → Operação (PRODUCT.md Seção 25)
 */
export async function startAttendanceFromAppointment(appointmentId: string) {
  const supabase = await createClient();

  // 1. Busca dados do agendamento e itens
  const { data: appointment, error: appError } = await supabase
    .from("appointments")
    .select("*, items:appointment_items(*)")
    .eq("id", appointmentId)
    .single();

  if (appError || !appointment) {
    return { success: false, error: "Agendamento não encontrado." };
  }

  // 2. Cria o atendimento na tabela de operações
  const { data: attendance, error: attError } = await supabase
    .from("attendances")
    .insert({
      company_id: appointment.company_id,
      unit_id: appointment.unit_id,
      customer_id: appointment.customer_id,
      vehicle_id: appointment.vehicle_id,
      appointment_id: appointment.id,
      status: "na_fila",
      total_price: appointment.total_price,
      is_paid: false,
      started_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (attError) return { success: false, error: "Erro ao iniciar atendimento." };

  // 3. Copia itens do agendamento para o atendimento
  await supabase.from("attendance_items").insert(
    appointment.items.map((item: any) => ({
      attendance_id: attendance.id,
      service_id: item.service_id,
      service_name: item.service_name,
      vehicle_type: "hatch", // TODO: buscar tipo real do veículo na tabela vehicles
      applied_price: item.applied_price,
      added_during_service: false
    }))
  );

  // 4. Marca agendamento como 'in_progress'
  await supabase.from("appointments").update({ status: "in_progress" }).eq("id", appointmentId);

  revalidatePath("/agenda");
  revalidatePath("/operacao");
  return { success: true };
}

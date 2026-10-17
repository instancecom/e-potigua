"use server";

import { createClient } from "@/lib/supabase/server";
import { appointmentSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export interface AppointmentActionResult {
  success: boolean;
  error?: string;
}

/**
 * Registra um agendamento.
 * Validações de disponibilidade e capacidade operacional seriam complexas aqui,
 * mas seguindo o princípio da simplicidade (YAGNI), começamos com a persistência.
 */
export async function createAppointmentAction(
  prevState: AppointmentActionResult | null,
  formData: FormData
): Promise<AppointmentActionResult> {
  const supabase = await createClient();

  const rawData = {
    unitId: formData.get("unitId"),
    vehicleId: formData.get("vehicleId"),
    scheduledAt: formData.get("scheduledAt"),
    serviceIds: formData.getAll("serviceIds"),
    notes: formData.get("notes"),
  };

  const parsed = appointmentSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { unitId, vehicleId, scheduledAt, serviceIds, notes } = parsed.data;

  // 1. Busca os dados dos serviços para calcular valor total e duração
  const { data: services } = await supabase
    .from("service_prices")
    .select("service_id, price, estimated_duration_minutes, services(name)")
    .in("service_id", serviceIds);

  if (!services || services.length === 0) {
    return { success: false, error: "Serviços não encontrados." };
  }

  const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = services.reduce((sum, s) => sum + s.estimated_duration_minutes, 0);
  const estimatedEndAt = new Date(new Date(scheduledAt).getTime() + totalDuration * 60000).toISOString();

  // 2. Cria o agendamento
  const { data: appointment, error: appError } = await supabase
    .from("appointments")
    .insert({
      unit_id: unitId,
      vehicle_id: vehicleId,
      customer_id: (await supabase.from("vehicles").select("customer_id").eq("id", vehicleId).single()).data?.customer_id,
      scheduled_at: scheduledAt,
      estimated_end_at: estimatedEndAt,
      total_duration_minutes: totalDuration,
      total_price: totalPrice,
      status: "scheduled",
      notes
    })
    .select("id")
    .single();

  if (appError) return { success: false, error: "Erro ao criar agendamento." };

  // 3. Insere os itens do agendamento
  await supabase.from("appointment_items").insert(
    services.map(s => {
      const serviceDetail = Array.isArray(s.services) ? s.services[0] : s.services;
      return {
        appointment_id: appointment.id,
        service_id: s.service_id,
        service_name: serviceDetail?.name,
        applied_price: s.price,
        duration_minutes: s.estimated_duration_minutes
      };
    })
  );

  revalidatePath("/agenda");
  return { success: true };
}

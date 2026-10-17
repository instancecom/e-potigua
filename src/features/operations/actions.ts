"use server";

import { AttendanceOperationalStatus } from "./types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface AttendanceActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Atualiza o status do atendimento operacional.
 */
export async function updateAttendanceStatus(
  attendanceId: string,
  newStatus: AttendanceOperationalStatus,
  unitId: string
) {
  const supabase = await createClient();

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

/**
 * Adiciona serviço a atendimento existente.
 */
export async function addServiceToAttendance(
  attendanceId: string,
  serviceId: string,
  price: number,
  unitId: string
) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_attendance_service", {
    p_attendance_id: attendanceId,
    p_service_id: serviceId,
    p_price: price,
    p_unit_id: unitId
  });

  if (error) throw new Error("Erro ao adicionar serviço.");
  return { success: true };
}

/**
 * Cria um atendimento direto (walk-in) pelo administrador.
 * Não requer agendamento prévio.
 */
export async function createAttendanceAction(
  prevState: AttendanceActionResult | null,
  formData: FormData
): Promise<AttendanceActionResult> {
  const supabase = await createClient();

  // Verifica se é proprietário
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "owner") {
    return { success: false, error: "Apenas proprietários podem criar atendimentos diretos." };
  }

  const rawData = {
    licensePlate: formData.get("licensePlate"),
    vehicleModel: formData.get("vehicleModel"),
    vehicleType: formData.get("vehicleType"),
  };

  // Validação básica
  if (!rawData.licensePlate) {
    return { success: false, error: "Placa é obrigatória." };
  }

  try {
    // 1. Busca ou cria cliente genérico para walk-in (sem conta)
    // Por simplicidade, criamos um cliente "Walk-in" por unidade se não existir
    let { data: walkinCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("company_id", profile.company_id)
      .eq("name", "Cliente Avulso")
      .single();

    if (!walkinCustomer) {
      const { data: newCustomer, error: custError } = await supabase
        .from("customers")
        .insert({
          company_id: profile.company_id,
          name: "Cliente Avulso",
          phone: "00000000000"
        })
        .select("id")
        .single();
      if (custError) throw custError;
      walkinCustomer = newCustomer;
    }

    // 2. Busca ou cria veículo
    let { data: vehicle } = await supabase
      .from("vehicles")
      .select("id")
      .eq("company_id", profile.company_id)
      .eq("license_plate", rawData.licensePlate)
      .single();

    if (!vehicle) {
      const { data: newVehicle, error: vehError } = await supabase
        .from("vehicles")
        .insert({
          company_id: profile.company_id,
          customer_id: walkinCustomer.id,
          license_plate: rawData.licensePlate,
          brand: "Não informado",
          model: rawData.vehicleModel || "Não informado",
          color: "Não informado",
          type: rawData.vehicleType || "hatch"
        })
        .select("id")
        .single();
      if (vehError) throw vehError;
      vehicle = newVehicle;
    }

    // 3. Busca primeira unidade ativa da empresa
    const { data: unit } = await supabase
      .from("units")
      .select("id")
      .eq("company_id", profile.company_id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!unit) return { success: false, error: "Nenhuma unidade ativa encontrada." };

    // 4. Cria o atendimento direto
    const { data: attendance, error: attError } = await supabase
      .from("attendances")
      .insert({
        company_id: profile.company_id,
        unit_id: unit.id,
        customer_id: walkinCustomer.id,
        vehicle_id: vehicle.id,
        status: "na_fila",
        total_price: 0, // Será atualizado quando adicionar serviços
        is_paid: false,
        started_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (attError) throw attError;

    revalidatePath("/admin");
    revalidatePath("/operacao");
    return { success: true, message: "Atendimento iniciado! Adicione os serviços na tela de operação." };

  } catch (err: any) {
    console.error("Erro ao criar atendimento walk-in:", err);
    return { success: false, error: err.message || "Erro ao criar atendimento." };
  }
}
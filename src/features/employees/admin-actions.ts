"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEmployeeUnitAction(employeeId: string, unitId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { error } = await supabase
    .from("employees")
    .update({ active_unit_id: unitId })
    .eq("id", employeeId);

  if (error) return { success: false, error: "Erro ao atualizar unidade." };

  revalidatePath("/admin/equipe");
  return { success: true };
}

export async function createEmployeeAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();
  
  const { error } = await supabase.from("employees").insert({
    company_id: profile?.company_id,
    user_id: formData.get("userId") as string,
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    primary_unit_id: formData.get("unitId") as string,
    active_unit_id: formData.get("unitId") as string,
  });

  if (error) return { success: false, error: "Erro ao cadastrar funcionário." };
  revalidatePath("/admin/equipe");
  return { success: true };
}

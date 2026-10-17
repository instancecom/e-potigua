"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface EmployeeActionResult {
  success: boolean;
  error?: string;
}

/**
 * Registra a transferência temporária de um funcionário para outra unidade.
 * (PRODUCT.md Seção 5, DATABASE.md Seção 7)
 */
export async function transferEmployeeAction(
  employeeId: string,
  targetUnitId: string,
  reason: string
): Promise<EmployeeActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  // 1. Busca funcionário e empresa
  const { data: employee } = await supabase
    .from("employees")
    .select("company_id, active_unit_id")
    .eq("id", employeeId)
    .single();

  if (!employee) return { success: false, error: "Funcionário não encontrado." };

  // 2. Registra a transferência
  const { error: transError } = await supabase
    .from("employee_transfers")
    .insert({
      company_id: employee.company_id,
      employee_id: employeeId,
      from_unit_id: employee.active_unit_id,
      to_unit_id: targetUnitId,
      reason,
      transferred_by_user_id: user.id
    });

  if (transError) return { success: false, error: "Erro ao registrar transferência." };

  // 3. Atualiza o status do funcionário na tabela employees
  const { error: updateError } = await supabase
    .from("employees")
    .update({ active_unit_id: targetUnitId })
    .eq("id", employeeId);

  if (updateError) return { success: false, error: "Erro ao atualizar unidade do funcionário." };

  revalidatePath("/admin/equipe");
  return { success: true };
}

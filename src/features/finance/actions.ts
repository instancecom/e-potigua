"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface FinanceActionResult {
  success: boolean;
  error?: string;
}

import { addStampAction } from "../loyalty/actions";

/**
 * Registra o pagamento de um atendimento.
 * Atualiza status do atendimento, registra a transação financeira e adiciona carimbo de fidelidade.
 */
export async function finalizePaymentAction(
  attendanceId: string,
  paymentMethod: string,
  amount: number
): Promise<FinanceActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  // 1. Busca os detalhes do atendimento (para fidelidade)
  const { data: attendance, error: attFetchError } = await supabase
    .from("attendances")
    .select("company_id, customer_id")
    .eq("id", attendanceId)
    .single();

  if (attFetchError || !attendance) return { success: false, error: "Atendimento não encontrado." };

  // 2. Atualiza atendimento como pago
  const { error: attError } = await supabase
    .from("attendances")
    .update({ 
      is_paid: true, 
      payment_method: paymentMethod 
    })
    .eq("id", attendanceId);

  if (attError) return { success: false, error: "Erro ao registrar pagamento." };

  // 3. Registra na transação financeira
  const { error: finError } = await supabase
    .from("financial_transactions")
    .insert({
      company_id: attendance.company_id,
      attendance_id: attendanceId,
      type: "income",
      amount: amount,
      payment_method: paymentMethod,
      category: "servico_lavagem",
      description: `Pagamento de atendimento #${attendanceId.slice(0, 8)}`,
      recorded_by_user_id: user.id
    });

  if (finError) return { success: false, error: "Erro ao registrar transação financeira." };

  // 4. Se o cliente tiver conta (customer_id), tenta adicionar carimbo de fidelidade
  if (attendance.customer_id) {
    await addStampAction(attendance.customer_id);
  }

  revalidatePath("/operacao");
  revalidatePath("/financeiro");
  revalidatePath("/admin/fidelidade");
  return { success: true };
}

/**
 * Registra uma saída financeira manual (ex: compra de produtos)
 * (DATABASE.md Seção 23)
 */
export async function registerExpenseAction(
  amount: number,
  category: string,
  description: string
): Promise<FinanceActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("financial_transactions")
    .insert({
      type: "expense",
      amount,
      category,
      description,
      recorded_by_user_id: user?.id
    });

  if (error) return { success: false, error: "Erro ao registrar despesa." };

  revalidatePath("/financeiro");
  return { success: true };
}

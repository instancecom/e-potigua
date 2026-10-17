"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface LoyaltyActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Atribui 1 carimbo ao cartão de fidelidade do cliente após um atendimento pago.
 * (PRODUCT.md Seção 18)
 */
export async function addStampAction(customerId: string): Promise<LoyaltyActionResult> {
  const supabase = await createClient();

  // 1. Busca empresa do usuário logado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) return { success: false, error: "Empresa não encontrada." };

  // 2. Busca ou cria o cartão de fidelidade do cliente
  let { data: card } = await supabase
    .from("loyalty_cards")
    .select("*")
    .eq("company_id", profile.company_id)
    .eq("customer_id", customerId)
    .single();

  if (!card) {
    const { data: newCard, error: createError } = await supabase
      .from("loyalty_cards")
      .insert({
        company_id: profile.company_id,
        customer_id: customerId,
        current_stamps: 0,
      })
      .select("*")
      .single();

    if (createError || !newCard) return { success: false, error: "Erro ao criar cartão de fidelidade." };
    card = newCard;
  }

  if (card.current_stamps >= 8) {
    return { success: false, error: "O cartão já possui os 8 carimbos completos. É necessário resgatar a recompensa." };
  }

  const newStamps = card.current_stamps + 1;

  // 3. Atualiza carimbos
  const { error: updateError } = await supabase
    .from("loyalty_cards")
    .update({ 
      current_stamps: newStamps,
      updated_at: new Date().toISOString()
    })
    .eq("id", card.id);

  if (updateError) return { success: false, error: "Erro ao adicionar carimbo." };

  revalidatePath("/admin/fidelidade");
  return { success: true, message: `Carimbo adicionado com sucesso! (${newStamps}/8)` };
}

/**
 * Confirma o resgate de uma recompensa utilizando o código único.
 * (PRODUCT.md Seção 20)
 */
export async function confirmRedemptionAction(redemptionCode: string): Promise<LoyaltyActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  // 1. Busca o resgate pelo código
  const { data: redemption, error: redError } = await supabase
    .from("loyalty_redemptions")
    .select("*, customers(id, company_id)")
    .eq("redemption_code", redemptionCode.trim().toUpperCase())
    .single();

  if (redError || !redemption) {
    return { success: false, error: "Código de resgate inválido ou não encontrado." };
  }

  if (redemption.is_confirmed) {
    return { success: false, error: "Este código de resgate já foi utilizado." };
  }

  // 2. Confirma o resgate
  const { error: confirmError } = await supabase
    .from("loyalty_redemptions")
    .update({
      is_confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmed_by_user_id: user.id
    })
    .eq("id", redemption.id);

  if (confirmError) return { success: false, error: "Erro ao confirmar resgate." };

  // 3. Zera os carimbos do cliente e incrementa o ciclo completado
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("*")
    .eq("customer_id", redemption.customer_id)
    .single();

  if (card) {
    await supabase
      .from("loyalty_cards")
      .update({
        current_stamps: 0,
        total_cycles_completed: card.total_cycles_completed + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", card.id);
  }

  revalidatePath("/admin/fidelidade");
  return { success: true, message: "Recompensa resgatada e carimbos zerados com sucesso!" };
}

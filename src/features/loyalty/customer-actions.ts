"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function requestRedemptionAction(companyId: string, customerId: string) {
  const supabase = await createClient();

  // 1. Verifica se o cliente tem 8 carimbos
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("current_stamps")
    .eq("company_id", companyId)
    .eq("customer_id", customerId)
    .single();

  if (!card || card.current_stamps < 8) {
    return { success: false, error: "Você precisa completar 8 carimbos para resgatar." };
  }

  // 2. Busca recompensa ativa da empresa
  const { data: reward } = await supabase
    .from("loyalty_rewards")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!reward) {
    return { success: false, error: "Esta empresa não configurou uma recompensa no momento." };
  }

  // 3. Gera código único aleatório de 6 caracteres
  const redemptionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  // 4. Cria o registro de resgate
  const { error } = await supabase.from("loyalty_redemptions").insert({
    company_id: companyId,
    customer_id: customerId,
    redemption_code: redemptionCode,
    is_confirmed: false,
    reward_type: reward.reward_type,
    description: reward.description
  });

  if (error) return { success: false, error: "Erro ao gerar código de resgate." };

  revalidatePath("/cliente");
  return { success: true, code: redemptionCode };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function requestInventoryReplenishmentAction(
  itemId: string,
  notes: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: item } = await supabase
    .from("inventory_items")
    .select("company_id, unit_id")
    .eq("id", itemId)
    .single();

  if (!item) return { success: false, error: "Item não encontrado." };

  const { error } = await supabase
    .from("inventory_replenishment_requests")
    .insert({
      company_id: item.company_id,
      unit_id: item.unit_id,
      item_id: itemId,
      requested_by_user_id: user.id,
      status: "pending",
      notes
    });

  if (error) return { success: false, error: "Erro ao solicitar reposição." };

  revalidatePath("/admin/estoque");
  return { success: true };
}

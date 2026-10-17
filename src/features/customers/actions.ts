"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCustomerAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();

  const { error } = await supabase.from("customers").insert({
    company_id: profile?.company_id,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  });

  if (error) return { success: false, error: "Erro ao cadastrar cliente." };
  revalidatePath("/admin/clientes");
  return { success: true };
}

export async function createVehicleAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado." };

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();

  const { error } = await supabase.from("vehicles").insert({
    company_id: profile?.company_id,
    customer_id: formData.get("customerId") as string,
    license_plate: formData.get("licensePlate") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    color: formData.get("color") as string,
    type: formData.get("type") as string,
  });

  if (error) return { success: false, error: "Erro ao cadastrar veículo." };
  revalidatePath("/admin/clientes");
  return { success: true };
}

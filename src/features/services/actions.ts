"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export interface ServiceActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Cria um novo serviço com seus respectivos preços por tipo de veículo.
 * DATABASE.md: O preço pode variar conforme o tipo de veículo.
 */
export async function createServiceAction(
  prevState: ServiceActionResult | null,
  formData: FormData
): Promise<ServiceActionResult> {
  const supabase = await createClient();

  // 1. Obter usuário e empresa autenticada (Segurança multi-tenant)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.company_id || profile.role !== "owner") {
    return { success: false, error: "Apenas proprietários podem gerenciar serviços." };
  }

  // 2. Extrair e estruturar dados do formulário
  // Como podemos ter múltiplos preços para diferentes tipos de veículo, 
  // o form envia arrays ou JSON estruturado. Para simplicidade, vamos receber JSON ou campos parseados.
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const pricesJson = formData.get("prices") as string;

  let parsedPrices = [];
  try {
    parsedPrices = JSON.parse(pricesJson || "[]");
  } catch {
    return { success: false, error: "Formato de preços inválido." };
  }

  const rawData = {
    name,
    description: description || undefined,
    prices: parsedPrices,
  };

  const parsed = createServiceSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados do serviço inválidos.",
    };
  }

  const { name: serviceName, description: serviceDesc, prices } = parsed.data;

  // 3. Inserir Serviço
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .insert({
      company_id: profile.company_id,
      name: serviceName,
      description: serviceDesc,
      is_active: true,
    })
    .select("id")
    .single();

  if (serviceError || !service) {
    return { success: false, error: "Erro ao cadastrar serviço." };
  }

  // 4. Inserir Preços e Durações por Tipo de Veículo
  const priceInserts = prices.map((p) => ({
    company_id: profile.company_id,
    service_id: service.id,
    vehicle_type: p.vehicleType,
    price: p.price,
    estimated_duration_minutes: p.estimatedDurationMinutes,
  }));

  const { error: priceError } = await supabase
    .from("service_prices")
    .insert(priceInserts);

  if (priceError) {
    // Rollback conceitual ou exclusão do serviço órfão para manter consistência
    await supabase.from("services").delete().eq("id", service.id);
    return { success: false, error: "Erro ao cadastrar preços do serviço." };
  }

  revalidatePath("/admin/servicos");
  return { success: true, message: "Serviço cadastrado com sucesso!" };
}

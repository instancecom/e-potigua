"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  signInSchema,
  signUpOwnerSchema,
  resetPasswordSchema,
} from "./schemas";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Autentica o usuário com email e senha (SECURITY.md Seção 4).
 * Redireciona para o contexto correto com base no papel do usuário.
 */
export async function signInAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // SECURITY.md: Mensagem genérica para não revelar a existência de contas
    return {
      success: false,
      error: "Credenciais inválidas. Verifique seu e-mail e senha.",
    };
  }

  // Identifica o perfil de acesso do usuário para direcionamento contextual
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  let destination = "/admin";
  if (profile?.role === "employee") {
    destination = "/operacao";
  } else if (profile?.role === "customer") {
    destination = "/cliente";
  }

  redirect(destination);
}

/**
 * Cria a conta do Proprietário e configura a Empresa e 1ª Unidade (Onboarding).
 */
export async function signUpOwnerAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName"),
    unitName: formData.get("unitName"),
  };

  const parsed = signUpOwnerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dados inválidos.",
    };
  }

  const { fullName, email, password, companyName, unitName } = parsed.data;

  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Cria o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Não foi possível criar a conta. Tente outro e-mail.",
    };
  }

  const userId = authData.user.id;

  try {
    // 2. Gera um slug único para a empresa
    const baseSlug = companyName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug || "empresa"}-${randomSuffix}`;

    // 3. Insere a Empresa (Tenant)
    const { data: company, error: companyError } = await adminClient
      .from("companies")
      .insert({
        name: companyName,
        trade_name: companyName,
        slug,
        subscription_status: "trialing",
      })
      .select("id")
      .single();

    if (companyError || !company) {
      throw new Error(`Erro ao cadastrar empresa: ${companyError?.message}`);
    }

    // 4. Cria a primeira unidade operacional da empresa
    const { error: unitError } = await adminClient.from("units").insert({
      company_id: company.id,
      name: unitName,
      active_washers_count: 2,
      is_active: true,
    });

    if (unitError) {
      throw new Error(`Erro ao cadastrar unidade inicial: ${unitError.message}`);
    }

    // 5. Cria o perfil administrativo (Proprietário)
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: userId,
      company_id: company.id,
      role: "owner",
      full_name: fullName,
    });

    if (profileError) {
      throw new Error(`Erro ao vincular perfil de proprietário: ${profileError.message}`);
    }

    // Configuração de recompensas de fidelidade inicial
    await adminClient.from("loyalty_rewards").insert({
      company_id: company.id,
      reward_type: "service",
      reward_value: "Lavagem Completa",
      description: "Ganhe 1 Lavagem Completa grátis após completar os 8 carimbos.",
      is_active: true,
    });
  } catch (err: unknown) {
    console.error("Falha no onboarding do proprietário:", err);
    return {
      success: false,
      error: "Ocorreu um erro ao configurar a sua empresa. Por favor, tente novamente.",
    };
  }

  // Redireciona para o painel de administração
  redirect("/admin");
}

/**
 * Encerra a sessão do usuário.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Dispara e-mail para redefinição de senha.
 */
export async function resetPasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawEmail = formData.get("email");
  const parsed = resetPasswordSchema.safeParse({ email: rawEmail });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "E-mail inválido.",
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/redefinir-senha`,
  });

  // Mensagem neutra para preservar privacidade
  return {
    success: true,
    message:
      "Se houver uma conta associada a este e-mail, enviamos as instruções para recuperação de acesso.",
  };
}

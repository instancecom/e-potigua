import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cria o cliente administrativo do Supabase com Service Role Key.
 *
 * REGRAS DE SEGURANÇA (SECURITY.md):
 * - Uso estritamente restrito ao backend.
 * - Usado para webhooks confiáveis (Mercado Pago, Cakto) e automações do servidor.
 * - Ignora RLS, portanto toda verificação de contexto e tenant deve ser feita pelo backend.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configuração administrativa do Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

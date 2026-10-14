import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria uma instância do cliente Supabase para uso no servidor
 * (Server Components, Server Actions e Route Handlers).
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Configuração do Supabase ausente. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Se for chamado em um Server Component puro, o cookieStore.set() pode falhar.
          // Isso é esperado no App Router e o middleware cuidará do refresh da sessão.
        }
      },
    },
  });
}

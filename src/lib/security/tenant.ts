import { createClient } from "@/lib/supabase/server";

export type UserRole = "owner" | "employee" | "customer";

export interface TenantContext {
  userId: string;
  email?: string;
  companyId: string;
  activeUnitId?: string;
  role: UserRole;
  permissions: string[];
}

export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string = "Acesso não autorizado.") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;

  constructor(message: string = "Sessão inválida ou expirada.") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

/**
 * Obtém o usuário atualmente autenticado a partir do token de sessão.
 * NUNCA confia em identificadores recebidos pelo corpo da requisição (SECURITY.md).
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  return user;
}

/**
 * Validação rigorosa contra IDOR/BOLA (SECURITY.md Seção 16 e 49):
 * Garante que o recurso acessado pertence à empresa do contexto autenticado.
 */
export function assertTenantOwnership(
  contextCompanyId: string,
  resourceCompanyId: string
): void {
  if (!contextCompanyId || !resourceCompanyId || contextCompanyId !== resourceCompanyId) {
    throw new AuthorizationError(
      "Violação de isolamento multiempresa: o recurso solicitado pertence a outra organização."
    );
  }
}

/**
 * Validação de acesso à unidade física (SECURITY.md Seção 8):
 * Proprietários têm acesso a todas as unidades da empresa.
 * Funcionários possuem acesso restrito à sua unidade ativa ou unidade temporária autorizada.
 */
export function assertUnitAccess(
  context: TenantContext,
  resourceUnitId: string
): void {
  if (context.role === "owner") {
    return; // Proprietário possui visão de todas as unidades da sua empresa
  }

  if (context.activeUnitId !== resourceUnitId) {
    throw new AuthorizationError(
      "Acesso negado: o funcionário não está vinculado ou transferido para esta unidade."
    );
  }
}

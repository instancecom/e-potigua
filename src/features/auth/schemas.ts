import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const signUpOwnerSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  companyName: z.string().trim().min(2, "Informe o nome da empresa."),
  unitName: z.string().trim().min(2, "Informe o nome da primeira unidade (ex: Matriz, Centro)."),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpOwnerInput = z.infer<typeof signUpOwnerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

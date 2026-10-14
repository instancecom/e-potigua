"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpOwnerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Building, Store } from "lucide-react";

export default function RegisterOwnerPage() {
  const [state, formAction, isPending] = useActionState(signUpOwnerAction, null);

  return (
    <Card className="border-border-subtle shadow-xs">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Cadastrar sua Empresa
        </CardTitle>
        <CardDescription>
          Crie seu ambiente administrativo SaaS e sua primeira unidade em poucos segundos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-[8px] bg-status-error/10 border border-status-error/20 flex items-start gap-2.5 text-xs text-status-error font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-3.5">
            {/* Dados do Proprietário */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-petrol">
                1. Seus Dados de Acesso
              </p>
              <Input
                label="Seu Nome Completo"
                id="fullName"
                name="fullName"
                placeholder="Ex: Carlos Silva"
                required
                autoComplete="name"
              />

              <Input
                label="Seu E-mail"
                id="email"
                name="email"
                type="email"
                placeholder="carlos@seulavarapido.com"
                required
                autoComplete="email"
              />

              <Input
                label="Senha de Acesso"
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Dados do Negócio */}
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-petrol">
                2. Informações da Empresa
              </p>
              <Input
                label="Nome do Lava-Rápido ou Estética"
                id="companyName"
                name="companyName"
                placeholder="Ex: Potiguá Estética Automotiva"
                required
              />

              <Input
                label="Nome da 1ª Unidade Operacional"
                id="unitName"
                name="unitName"
                placeholder="Ex: Unidade Centro ou Matriz"
                helperText="Você poderá cadastrar novas unidades posteriormente."
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="petrol"
            className="w-full mt-3"
            isLoading={isPending}
          >
            <span>Criar Empresa e Acessar</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <div className="pt-4 border-t border-border-subtle text-center">
            <p className="text-xs text-text-muted">
              Já possui uma empresa cadastrada?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-action hover:underline"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

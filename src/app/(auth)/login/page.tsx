"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <Card className="border-border-subtle shadow-xs">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Acessar plataforma
        </CardTitle>
        <CardDescription>
          Entre com seu e-mail e senha para gerenciar ou operar.
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
            <Input
              label="E-mail"
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
                >
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs font-medium text-brand-action hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isPending}
          >
            <span>Entrar no Sistema</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <div className="pt-4 border-t border-border-subtle text-center">
            <p className="text-xs text-text-muted">
              É proprietário e quer gerenciar seu lava-rápido?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-brand-petrol hover:underline"
              >
                Cadastrar Empresa
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

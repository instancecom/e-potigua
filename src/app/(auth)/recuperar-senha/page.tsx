"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  return (
    <Card className="border-border-subtle shadow-xs">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Recuperar acesso
        </CardTitle>
        <CardDescription>
          Informe seu e-mail cadastrado para receber um link de redefinição de senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-[12px] bg-status-success/10 border border-status-success/20 flex items-start gap-3 text-sm text-status-success">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{state.message}</p>
            </div>
            <Link href="/login" className="w-full block">
              <Button variant="secondary" className="w-full" type="button">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Voltar para o login</span>
              </Button>
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-[8px] bg-status-error/10 border border-status-error/20 flex items-start gap-2.5 text-xs text-status-error font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <Input
              label="Seu E-mail Cadastrado"
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isPending}
            >
              Enviar link de recuperação
            </Button>

            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

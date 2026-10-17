"use client";

import { useActionState } from "react";
import { confirmRedemptionAction } from "@/features/loyalty/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmRedemptionPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const code = formData.get("code") as string;
      return await confirmRedemptionAction(code);
    },
    null
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <Card className="border-border-subtle shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-brand-petrol">Confirmar Resgate de Fidelidade</CardTitle>
          <p className="text-sm text-text-muted">Digite o código apresentado pelo cliente no balcão.</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input 
              name="code" 
              label="Código de Resgate" 
              placeholder="Ex: A7B2K9" 
              required 
              className="uppercase tracking-widest font-mono text-center text-lg"
            />

            {state?.error && (
              <div className="p-3 rounded-[8px] bg-status-error/10 text-status-error text-xs font-medium border border-status-error/20">
                {state.error}
              </div>
            )}
            
            {state?.message && (
              <div className="p-3 rounded-[8px] bg-status-success/10 text-status-success text-xs font-medium border border-status-success/20">
                {state.message}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" isLoading={isPending}>
              Confirmar Entrega da Recompensa
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

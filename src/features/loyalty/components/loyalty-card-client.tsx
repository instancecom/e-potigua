"use client";

import { useActionState } from "react";
import { requestRedemptionAction } from "@/features/loyalty/customer-actions";
import { Button } from "@/components/ui/button";

export function LoyaltyCardClient({ card }: { card: any }) {
  const [state, formAction, isPending] = useActionState(
    async () => await requestRedemptionAction(card.company_id, card.customer_id), 
    null
  );

  const company = Array.isArray(card.company) ? card.company[0] : card.company;

  return (
    <div className="bg-surface p-4 rounded-[12px] border border-border-subtle space-y-4">
      <p className="text-sm font-bold">{company?.name}</p>
      
      <div className="flex gap-1.5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${i < card.current_stamps ? 'bg-brand-action text-white border-brand-action' : 'bg-background border-border-subtle text-text-muted'}`}>
            {i + 1}
          </div>
        ))}
      </div>

      {card.current_stamps === 8 && !state?.code && (
        <form action={formAction}>
          <Button variant="primary" size="compact" className="w-full" isLoading={isPending}>
            Resgatar Recompensa
          </Button>
        </form>
      )}

      {state?.code && (
        <div className="p-3 bg-brand-action/10 border border-brand-action/20 rounded-[8px] text-center">
          <p className="text-xs text-text-muted">Seu código de resgate:</p>
          <p className="text-lg font-extrabold text-brand-action tracking-widest">{state.code}</p>
          <p className="text-[10px] text-text-muted mt-1">Apresente este código no balcão.</p>
        </div>
      )}

      {state?.error && (
        <p className="text-xs text-status-error">{state.error}</p>
      )}
    </div>
  );
}

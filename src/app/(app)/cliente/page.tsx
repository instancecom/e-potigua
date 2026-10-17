import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoyaltyCardClient } from "@/features/loyalty/components/loyalty-card-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PortalClientePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Busca atendimentos do usuário logado
  const { data: attendances } = await supabase
    .from("attendances")
    .select(`
      id,
      status,
      started_at,
      company:companies(name),
      vehicle:vehicles(license_plate, model)
    `)
    .eq("customer_id", user.id)
    .order("started_at", { ascending: false });

  // Busca cartões de fidelidade do usuário
  const { data: loyaltyCards } = await supabase
    .from("loyalty_cards")
    .select(`
      id,
      company_id,
      customer_id,
      current_stamps,
      company:companies(name)
    `)
    .eq("customer_id", user.id);

  return (
    <div className="max-w-xl mx-auto p-4 pb-20 space-y-8">
      <h1 className="text-2xl font-bold text-brand-petrol">Meu Portal</h1>

      {/* Seção de Atendimentos */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Acompanhamento</h2>
        {attendances?.map((att) => {
          const company = Array.isArray(att.company) ? att.company[0] : att.company;
          const vehicle = Array.isArray(att.vehicle) ? att.vehicle[0] : att.vehicle;
          return (
            <Card key={att.id} className="border-border-subtle">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold">{company?.name}</p>
                  <p className="text-xs text-text-muted">{vehicle?.model} • {vehicle?.license_plate}</p>
                </div>
                <Badge variant={att.status === "finalizado" ? "success" : "action"}>
                  {att.status === "na_fila" ? "Na fila" : att.status}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Seção de Fidelidade */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Cartões de Fidelidade</h2>
        {loyaltyCards?.map((card) => (
          <LoyaltyCardClient key={card.id} card={card} />
        ))}

        {(!loyaltyCards || loyaltyCards.length === 0) && (
          <p className="text-center py-10 text-text-muted text-sm">
            Nenhum cartão de fidelidade ativo.
          </p>
        )}
      </section>
    </div>
  );
}
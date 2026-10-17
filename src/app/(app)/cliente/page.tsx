import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PortalClientePage() {
  const supabase = await createClient();

  // Busca atendimentos do usuário logado em todas as empresas que ele é cliente
  const { data: attendances } = await supabase
    .from("attendances")
    .select(`
      id,
      status,
      started_at,
      company:companies(name),
      vehicle:vehicles(license_plate, model)
    `)
    .order("started_at", { ascending: false });

  // Busca cartões de fidelidade do usuário em todas as empresas
  const { data: loyaltyCards } = await supabase
    .from("loyalty_cards")
    .select(`
      current_stamps,
      company:companies(name)
    `);

  return (
    <div className="max-w-xl mx-auto p-4 pb-20 space-y-8">
      <h1 className="text-2xl font-bold text-brand-petrol">Meu Portal</h1>

      {/* Seção de Atendimentos */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Acompanhamento</h2>
        {attendances?.map((att: any) => {
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
        {loyaltyCards?.map((card: any, i: number) => {
          const company = Array.isArray(card.company) ? card.company[0] : card.company;
          return (
            <Card key={i} className="border-border-subtle bg-surface">
              <CardContent className="p-4">
                <p className="text-sm font-bold mb-2">{company?.name}</p>
                <div className="flex gap-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs ${i < card.current_stamps ? 'bg-brand-action text-white border-brand-action' : 'bg-background border-border-subtle'}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

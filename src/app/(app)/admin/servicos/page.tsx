import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ServicesListPage() {
  const supabase = await createClient();

  // Busca os serviços da empresa atual junto com seus preços
  const { data: services } = await supabase
    .from("services")
    .select(`
      id,
      name,
      description,
      is_active,
      prices:service_prices(vehicle_type, price, estimated_duration_minutes)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Serviços</h1>
          <p className="text-sm text-text-muted">Gerencie os serviços oferecidos e seus valores por veículo.</p>
        </div>
        <Link href="/admin/servicos/novo">
          <Button variant="primary">Novo Serviço</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {services?.map((service) => (
          <Card key={service.id} className="border-border-subtle shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{service.name}</CardTitle>
              <Badge variant={service.is_active ? "success" : "error"}>
                {service.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.description && (
                <p className="text-sm text-text-muted">{service.description}</p>
              )}

              <div className="border-t border-border-subtle pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">
                  Preços e Durações
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {service.prices?.map((p: any, idx: number) => (
                    <div key={idx} className="bg-background p-2.5 rounded-[8px] border border-border-subtle">
                      <div className="text-xs font-medium uppercase text-text-muted">{p.vehicle_type}</div>
                      <div className="text-sm font-bold text-brand-petrol">R$ {Number(p.price).toFixed(2)}</div>
                      <div className="text-xs text-text-muted">{p.estimated_duration_minutes} min</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!services || services.length === 0) && (
          <Card className="p-12 text-center border-border-subtle">
            <p className="text-sm text-text-muted mb-4">Nenhum serviço cadastrado ainda.</p>
            <Link href="/admin/servicos/novo">
              <Button variant="primary">Cadastrar Primeiro Serviço</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

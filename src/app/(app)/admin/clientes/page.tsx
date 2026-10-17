import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select(`
      id,
      name,
      phone,
      email,
      vehicles(id, license_plate, brand, model, type)
    `)
    .order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Clientes & Veículos</h1>

      <div className="grid gap-4">
        {customers?.map((customer: any) => {
          const vehicles = Array.isArray(customer.vehicles) ? customer.vehicles : [];
          return (
            <Card key={customer.id} className="border-border-subtle">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">{customer.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-text-muted">
                  {customer.phone && <span>Tel: {customer.phone}</span>}
                  {customer.email && <span className="ml-4">E-mail: {customer.email}</span>}
                </div>

                <div className="border-t border-border-subtle pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2">Veículos Cadastrados</span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {vehicles.map((v: any) => (
                      <div key={v.id} className="bg-background p-2 rounded-[8px] border border-border-subtle flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold">{v.license_plate} • {v.model}</p>
                          <p className="text-[10px] text-text-muted">{v.brand} ({v.type})</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{v.type}</Badge>
                      </div>
                    ))}
                    {vehicles.length === 0 && (
                      <p className="text-xs text-text-muted">Nenhum veículo cadastrado para este cliente.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!customers || customers.length === 0) && (
          <div className="text-center py-10 text-text-muted text-sm">
            Nenhum cliente cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

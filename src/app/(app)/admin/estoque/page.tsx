import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EstoquePage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("is_active", true);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Estoque</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <Card key={item.id} className="border-border-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-brand-petrol">
                  {Number(item.current_quantity)} <span className="text-xs font-normal text-text-muted">{item.unit_of_measure}</span>
                </p>
                {item.current_quantity <= (item.minimum_alert_quantity || 0) && (
                  <Badge variant="error">Repor</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

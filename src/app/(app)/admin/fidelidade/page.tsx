import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FidelidadePage() {
  const supabase = await createClient();

  // Busca cartões ativos com informações do cliente
  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select(`
      id,
      current_stamps,
      customer:customers(name, phone)
    `)
    .order("current_stamps", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Fidelidade</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards?.map((card) => (
          <Card key={card.id} className="border-border-subtle shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{card.customer?.name || "Cliente"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${i < card.current_stamps ? 'bg-brand-action text-white border-brand-action' : 'bg-background border-border-subtle text-text-muted'}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <Badge variant={card.current_stamps === 8 ? "action" : "default"}>
                  {card.current_stamps} / 8
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

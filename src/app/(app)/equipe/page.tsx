import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EquipePage() {
  const supabase = await createClient();

  // Busca funcionários com informações de unidade
  const { data: employees } = await supabase
    .from("employees")
    .select(`
      id,
      name,
      role,
      is_active,
      primary_unit:units!employees_primary_unit_id_fkey(name),
      active_unit:units!employees_active_unit_id_fkey(name)
    `)
    .order("name", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-petrol">Equipe & Unidades</h1>

      <div className="grid gap-4">
        {employees?.map((emp: any) => {
          const primaryUnit = Array.isArray(emp.primary_unit) ? emp.primary_unit[0] : emp.primary_unit;
          const activeUnit = Array.isArray(emp.active_unit) ? emp.active_unit[0] : emp.active_unit;
          const isTransferred = emp.primary_unit_id !== emp.active_unit_id;

          return (
            <Card key={emp.id} className="border-border-subtle">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-text-main">{emp.name}</p>
                  <p className="text-xs text-text-muted">
                    Unidade Principal: {primaryUnit?.name || "Não definida"}
                  </p>
                  <p className="text-xs text-text-muted">
                    Atuando em: <strong className="text-brand-petrol">{activeUnit?.name || "Indefinida"}</strong>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={emp.is_active ? "success" : "error"}>{emp.role}</Badge>
                  {isTransferred && <Badge variant="warning">Transferido</Badge>}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {(!employees || employees.length === 0) && (
          <div className="text-center py-10 text-text-muted text-sm">
            Nenhum funcionário cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { updateEmployeeUnitAction } from "@/features/employees/admin-actions";

export default async function EquipeConfigPage() {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from("employees")
    .select(`id, name, active_unit_id, units!employees_active_unit_id_fkey(name)`);

  const { data: units } = await supabase
    .from("units")
    .select("id, name");

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold text-brand-petrol">Configuração de Equipe</h1>
      <div className="grid gap-4">
        {employees?.map((emp) => (
          <Card key={emp.id} className="border-border-subtle">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{emp.name}</p>
                <p className="text-xs text-text-muted">Atual: {(emp.units as any)?.name || "Nenhuma"}</p>
              </div>
              
              <form action={async (formData) => {
                "use server";
                await updateEmployeeUnitAction(emp.id, formData.get("unitId") as string);
              }}>
                <select name="unitId" defaultValue={emp.active_unit_id || ""} className="p-2 border rounded text-sm">
                  <option value="">Trocar unidade...</option>
                  {units?.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button type="submit" className="ml-2 text-xs bg-brand-action text-white p-2 rounded">Salvar</button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

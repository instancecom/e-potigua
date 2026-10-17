import { z } from "zod";

export const appointmentSchema = z.object({
  unitId: z.string().uuid("Unidade inválida."),
  vehicleId: z.string().uuid("Veículo inválido."),
  scheduledAt: z.string().datetime("Data/hora inválida."),
  serviceIds: z.array(z.string().uuid()).min(1, "Selecione pelo menos um serviço."),
  notes: z.string().optional(),
});

import { z } from "zod";

export const vehicleTypeEnum = z.enum([
  "hatch",
  "sedan",
  "suv",
  "pickup",
  "truck",
  "motorcycle",
]);

export const servicePriceSchema = z.object({
  vehicleType: vehicleTypeEnum,
  price: z.coerce.number().min(0, "O preço não pode ser negativo."),
  estimatedDurationMinutes: z.coerce.number().int().min(1, "A duração deve ser de pelo menos 1 minuto."),
});

export const createServiceSchema = z.object({
  name: z.string().min(2, "O nome do serviço deve ter pelo menos 2 caracteres."),
  description: z.string().optional(),
  prices: z.array(servicePriceSchema).min(1, "Defina ao menos um preço para o serviço."),
});

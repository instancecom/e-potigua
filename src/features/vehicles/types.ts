export type VehicleType =
  | "hatch"
  | "sedan"
  | "suv"
  | "pickup"
  | "truck"
  | "motorcycle";

export interface Vehicle {
  id: string;
  companyId: string;
  customerId: string;
  licensePlate: string; // Placa única
  brand: string;
  model: string;
  color: string;
  type: VehicleType;
  createdAt: string;
  updatedAt: string;
}

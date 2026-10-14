import { VehicleType } from "../vehicles/types";

export interface ServicePrice {
  id: string;
  serviceId: string;
  vehicleType: VehicleType;
  price: number;
  estimatedDurationMinutes: number;
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  isActive: boolean;
  prices: ServicePrice[];
  createdAt: string;
  updatedAt: string;
}

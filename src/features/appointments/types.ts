export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AppointmentServiceItem {
  serviceId: string;
  serviceName: string;
  appliedPrice: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  companyId: string;
  unitId: string;
  customerId: string;
  vehicleId: string;
  scheduledAt: string; // ISO timestamp do agendamento
  estimatedEndAt: string;
  totalDurationMinutes: number;
  totalPrice: number;
  status: AppointmentStatus;
  items: AppointmentServiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

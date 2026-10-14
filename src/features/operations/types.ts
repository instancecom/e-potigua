import { VehicleType } from "../vehicles/types";
import { PaymentMethod } from "../payments/types";

export type AttendanceOperationalStatus =
  | "na_fila"
  | "lavando"
  | "secando"
  | "finalizado";

export interface AttendanceServiceItem {
  id: string;
  attendanceId: string;
  serviceId: string;
  serviceName: string;
  vehicleType: VehicleType;
  appliedPrice: number; // Imutável após inserção (DATABASE.md Seção 2.3)
  addedDuringService: boolean; // Se foi adicionado pelo lavador durante a operação (PRODUCT.md Seção 12)
  createdAt: string;
}

export interface Attendance {
  id: string;
  companyId: string;
  unitId: string;
  customerId?: string; // Opcional se cliente for avulso sem cadastro
  vehicleId: string;
  appointmentId?: string; // Presente caso tenha vindo de agendamento prévio
  assignedEmployeeId?: string;
  status: AttendanceOperationalStatus;
  totalPrice: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  startedAt: string;
  completedAt?: string;
  items: AttendanceServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export type EmployeeRole = "washer" | "attendant" | "manager";

export interface Employee {
  id: string;
  companyId: string;
  userId?: string; // Vinculado à auth quando possui login
  primaryUnitId: string; // Unidade principal de vínculo
  activeUnitId: string; // Unidade em que está atuando no momento
  name: string;
  email?: string;
  phone?: string;
  role: EmployeeRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transferência temporária de unidade (PRODUCT.md Seção 5 e DATABASE.md Seção 7)
 */
export interface EmployeeTransfer {
  id: string;
  companyId: string;
  employeeId: string;
  fromUnitId: string;
  toUnitId: string;
  startedAt: string;
  endedAt?: string;
  reason?: string;
  transferredByUserId: string;
}

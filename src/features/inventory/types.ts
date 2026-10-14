export type ReplenishmentRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "fulfilled";

export interface InventoryItem {
  id: string;
  companyId: string;
  unitId: string;
  name: string;
  currentQuantity: number;
  unitOfMeasure: "unidade" | "litro" | "kg" | "caixa";
  minimumAlertQuantity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Solicitação de produto emitida pelo funcionário (PRODUCT.md Seção 21)
 */
export interface InventoryReplenishmentRequest {
  id: string;
  companyId: string;
  unitId: string;
  itemId: string;
  itemName: string;
  requestedByUserId: string;
  status: ReplenishmentRequestStatus;
  notes?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  createdAt: string;
}

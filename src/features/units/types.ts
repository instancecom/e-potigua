export interface Unit {
  id: string;
  companyId: string;
  name: string;
  address?: string;
  phone?: string;
  activeWashersCount: number; // Base para cálculo de capacidade operacional (PRODUCT.md Seção 6)
  openingTime: string; // ex: "08:00"
  closingTime: string; // ex: "18:00"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

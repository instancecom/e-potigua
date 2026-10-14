/**
 * Constante oficial do programa de fidelidade (PRODUCT.md Seção 18)
 */
export const LOYALTY_STAMPS_REQUIRED = 8;

export type LoyaltyRewardType = "cash" | "service";

export interface LoyaltyRewardConfig {
  id: string;
  companyId: string;
  rewardType: LoyaltyRewardType;
  rewardValue: number | string; // Valor monetário ou ID/Nome do serviço
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export interface LoyaltyCard {
  id: string;
  companyId: string;
  customerId: string;
  currentStamps: number; // 0 a 8
  totalCyclesCompleted: number;
  isRewardReady: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyRedemption {
  id: string;
  companyId: string;
  customerId: string;
  redemptionCode: string; // Código único alfanumérico gerado no app do cliente
  isConfirmed: boolean;
  confirmedAt?: string;
  confirmedByUserId?: string;
  rewardDetails: {
    rewardType: LoyaltyRewardType;
    description: string;
  };
  createdAt: string;
}

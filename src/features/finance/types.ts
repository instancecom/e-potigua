import { PaymentMethod } from "../payments/types";

export type FinancialTransactionType = "income" | "expense";

export interface FinancialTransaction {
  id: string;
  companyId: string;
  unitId?: string;
  attendanceId?: string; // Vinculado a um atendimento quando for entrada de serviço
  type: FinancialTransactionType;
  amount: number;
  paymentMethod?: PaymentMethod;
  category: string; // ex: "servico_lavagem", "produtos", "salarios", "manutencao"
  description: string;
  recordedByUserId: string;
  occurredAt: string;
  createdAt: string;
}

export interface FinancialSummary {
  period: "day" | "week" | "month";
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  byPaymentMethod: Record<PaymentMethod, number>;
}

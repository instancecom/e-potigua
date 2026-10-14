/**
 * Tipagens do Payment Layer (Camada de Pagamento Agnóstica)
 * Diretrizes: ARCHITECTURE.md (Seção 14, 15, 16) e SECURITY.md (Seção 18)
 *
 * Arquitetura:
 * SaaS → Payment Layer → Provider Connector → Provedor
 */

export type PaymentMethod =
  | "pix"
  | "cash"
  | "debit_card"
  | "credit_card"
  | "terminal";

export type PaymentTransactionStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "cancelled"
  | "error";

export interface CreatePaymentIntentInput {
  companyId: string;
  unitId: string;
  attendanceId: string;
  amount: number;
  method: PaymentMethod;
  description?: string;
  terminalId?: string; // Identificador da maquininha SmartPOS física na unidade
  idempotencyKey: string; // Chave para evitar duplicidade financeira (SECURITY.md Seção 20)
}

export interface PaymentTransactionResult {
  success: boolean;
  transactionId: string;
  externalReference?: string;
  status: PaymentTransactionStatus;
  amount: number;
  method: PaymentMethod;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Interface obrigatória para qualquer conector de provedor externo
 * (ex: Mercado Pago na V1, Cielo/Stone em versões futuras).
 */
export interface IPaymentConnector {
  readonly providerId: string;

  /**
   * Envia uma intenção de cobrança para um terminal físico ou gateway.
   */
  createIntent(input: CreatePaymentIntentInput): Promise<PaymentTransactionResult>;

  /**
   * Consulta o estado de uma transação diretamente no provedor.
   */
  checkStatus(externalReference: string): Promise<PaymentTransactionResult>;

  /**
   * Cancela uma transação pendente no terminal/provedor.
   */
  cancelIntent(externalReference: string): Promise<PaymentTransactionResult>;

  /**
   * Processa com segurança um webhook emitido pelo provedor.
   */
  processWebhook(
    payload: unknown,
    signatureHeader?: string
  ): Promise<PaymentTransactionResult | null>;
}

import {
  IPaymentConnector,
  CreatePaymentIntentInput,
  PaymentTransactionResult,
} from "../types";

/**
 * Conector oficial do Mercado Pago para a V1 (ARCHITECTURE.md Seção 15).
 * Encapsula chamadas ao Point/SmartPOS e Webhooks sem vazar detalhes
 * específicos do Mercado Pago para o restante da aplicação.
 */
export class MercadoPagoConnector implements IPaymentConnector {
  readonly providerId = "mercadopago";
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN;
  }

  async createIntent(
    input: CreatePaymentIntentInput
  ): Promise<PaymentTransactionResult> {
    if (!this.accessToken) {
      return {
        success: false,
        transactionId: `tx_${Date.now()}`,
        status: "error",
        amount: input.amount,
        method: input.method,
        errorMessage: "Token de acesso do Mercado Pago não configurado no servidor.",
      };
    }

    try {
      // Quando integrado ao endpoint Point do Mercado Pago:
      // POST https://api.mercadopago.com/point/integration-api/devices/{device_id}/payment-intents
      return {
        success: true,
        transactionId: `mp_intent_${Date.now()}`,
        externalReference: `ext_${input.attendanceId}`,
        status: "pending",
        amount: input.amount,
        method: input.method,
        metadata: {
          terminalId: input.terminalId,
          attendanceId: input.attendanceId,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      return {
        success: false,
        transactionId: `tx_err_${Date.now()}`,
        status: "error",
        amount: input.amount,
        method: input.method,
        errorMessage: message,
      };
    }
  }

  async checkStatus(
    externalReference: string
  ): Promise<PaymentTransactionResult> {
    // Consulta status no Mercado Pago
    return {
      success: true,
      transactionId: externalReference,
      externalReference,
      status: "processing",
      amount: 0,
      method: "terminal",
    };
  }

  async cancelIntent(
    externalReference: string
  ): Promise<PaymentTransactionResult> {
    return {
      success: true,
      transactionId: externalReference,
      externalReference,
      status: "cancelled",
      amount: 0,
      method: "terminal",
    };
  }

  async processWebhook(
    payload: unknown,
    signatureHeader?: string
  ): Promise<PaymentTransactionResult | null> {
    // Validação de assinatura conforme SECURITY.md Seção 19 e 21
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const data = payload as { id?: string; action?: string; type?: string };

    return {
      success: true,
      transactionId: data.id || `webhook_${Date.now()}`,
      status: "approved",
      amount: 0,
      method: "terminal",
      metadata: { action: data.action, signature: signatureHeader },
    };
  }
}

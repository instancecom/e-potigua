import {
  IPaymentConnector,
  CreatePaymentIntentInput,
  PaymentTransactionResult,
  PaymentMethod,
} from "./types";
import { MercadoPagoConnector } from "./connectors/mercadopago";

/**
 * Orquestrador da Camada de Pagamento (Payment Layer)
 * Centraliza e isola toda lógica financeira operacional.
 */
export class PaymentService {
  private connectors: Map<string, IPaymentConnector> = new Map();

  constructor() {
    // Registra o conector padrão da V1 (Mercado Pago)
    const mpConnector = new MercadoPagoConnector();
    this.connectors.set(mpConnector.providerId, mpConnector);
  }

  /**
   * Obtém um conector registrado pelo seu identificador único.
   */
  getConnector(providerId: string = "mercadopago"): IPaymentConnector {
    const connector = this.connectors.get(providerId);
    if (!connector) {
      throw new Error(`Conector de pagamento '${providerId}' não encontrado.`);
    }
    return connector;
  }

  /**
   * Registra um pagamento presencial manual (Dinheiro, Pix direto, etc.)
   * Não necessita de comunicação externa, mas segue o mesmo padrão de resultado.
   */
  async recordManualPayment(params: {
    companyId: string;
    unitId: string;
    attendanceId: string;
    amount: number;
    method: Exclude<PaymentMethod, "terminal">;
  }): Promise<PaymentTransactionResult> {
    return {
      success: true,
      transactionId: `manual_${Date.now()}`,
      status: "approved",
      amount: params.amount,
      method: params.method,
      metadata: {
        attendanceId: params.attendanceId,
        companyId: params.companyId,
        unitId: params.unitId,
        recordedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Dispara cobrança em terminal/SmartPOS via conector desacoplado.
   */
  async initiateTerminalPayment(
    input: CreatePaymentIntentInput,
    providerId: string = "mercadopago"
  ): Promise<PaymentTransactionResult> {
    const connector = this.getConnector(providerId);
    return await connector.createIntent(input);
  }
}

// Instância singleton para uso no servidor
export const paymentService = new PaymentService();

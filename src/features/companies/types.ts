export interface Company {
  id: string;
  name: string;
  tradeName?: string;
  document?: string; // CNPJ
  slug: string;
  subscriptionPlanId?: string;
  subscriptionStatus: "active" | "past_due" | "canceled" | "trialing";
  createdAt: string;
  updatedAt: string;
}

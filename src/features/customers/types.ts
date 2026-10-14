export interface Customer {
  id: string;
  companyId: string;
  userId?: string; // Opcional, cliente presencial pode não ter conta (PRODUCT.md Seção 15)
  name: string;
  phone?: string;
  email?: string;
  document?: string; // CPF
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

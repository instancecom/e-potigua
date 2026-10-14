-- ==============================================================================
-- e-potiguá - Migration 000001: Initial Schema & Multi-Tenant RLS
-- Diretrizes: DATABASE.md, ARCHITECTURE.md e SECURITY.md
-- ==============================================================================

-- 1. EXTENSÕES & UTILITÁRIOS
create extension if not exists "uuid-ossp";

-- Trigger genérico para atualização de updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==============================================================================
-- 2. TABELAS FUNDAMENTAIS
-- ==============================================================================

-- 2.1 Empresas (Tenants)
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trade_name text,
  document text, -- CNPJ
  slug text unique not null,
  subscription_plan_id text,
  subscription_status text not null default 'trialing' 
    check (subscription_status in ('active', 'past_due', 'canceled', 'trialing')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_companies_updated_at
  before update on companies
  for each row execute function handle_updated_at();

-- 2.2 Unidades Físicas
create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  address text,
  phone text,
  active_washers_count int not null default 1 check (active_washers_count >= 0),
  opening_time text not null default '08:00',
  closing_time text not null default '18:00',
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_units_updated_at
  before update on units
  for each row execute function handle_updated_at();

-- 2.3 Perfis de Usuário (Vinculados a auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  role text not null check (role in ('owner', 'employee', 'customer')),
  full_name text not null,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- 2.4 Funcionários e Unidades
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  primary_unit_id uuid references units(id) on delete restrict not null,
  active_unit_id uuid references units(id) on delete restrict not null,
  name text not null,
  email text,
  phone text,
  role text not null default 'washer' check (role in ('washer', 'attendant', 'manager')),
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_employees_updated_at
  before update on employees
  for each row execute function handle_updated_at();

-- 2.5 Transferências Temporárias entre Unidades
create table if not exists employee_transfers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  employee_id uuid references employees(id) on delete cascade not null,
  from_unit_id uuid references units(id) on delete restrict not null,
  to_unit_id uuid references units(id) on delete restrict not null,
  started_at timestamptz default now() not null,
  ended_at timestamptz,
  reason text,
  transferred_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 2.6 Clientes
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null, -- Null se cliente avulso presencial
  name text not null,
  phone text,
  email text,
  document text, -- CPF
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_customers_updated_at
  before update on customers
  for each row execute function handle_updated_at();

-- 2.7 Veículos
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  license_plate text not null,
  brand text not null,
  model text not null,
  color text not null,
  type text not null check (type in ('hatch', 'sedan', 'suv', 'pickup', 'truck', 'motorcycle')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_vehicles_updated_at
  before update on vehicles
  for each row execute function handle_updated_at();

-- 2.8 Serviços & Preços por Categoria de Veículo
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_services_updated_at
  before update on services
  for each row execute function handle_updated_at();

create table if not exists service_prices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  service_id uuid references services(id) on delete cascade not null,
  vehicle_type text not null check (vehicle_type in ('hatch', 'sedan', 'suv', 'pickup', 'truck', 'motorcycle')),
  price numeric(10,2) not null check (price >= 0),
  estimated_duration_minutes int not null check (estimated_duration_minutes > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (service_id, vehicle_type)
);

create trigger tr_service_prices_updated_at
  before update on service_prices
  for each row execute function handle_updated_at();

-- 2.9 Agendamentos
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete restrict not null,
  customer_id uuid references customers(id) on delete restrict not null,
  vehicle_id uuid references vehicles(id) on delete restrict not null,
  scheduled_at timestamptz not null,
  estimated_end_at timestamptz not null,
  total_duration_minutes int not null check (total_duration_minutes > 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  status text not null default 'scheduled' 
    check (status in ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_appointments_updated_at
  before update on appointments
  for each row execute function handle_updated_at();

create table if not exists appointment_items (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete cascade not null,
  service_id uuid references services(id) on delete restrict not null,
  service_name text not null,
  applied_price numeric(10,2) not null check (applied_price >= 0),
  duration_minutes int not null check (duration_minutes > 0),
  created_at timestamptz default now() not null
);

-- 2.10 Atendimentos Operacionais (4 Estados)
create table if not exists attendances (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete restrict not null,
  customer_id uuid references customers(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete restrict not null,
  appointment_id uuid references appointments(id) on delete set null,
  assigned_employee_id uuid references employees(id) on delete set null,
  status text not null default 'na_fila' 
    check (status in ('na_fila', 'lavando', 'secando', 'finalizado')),
  total_price numeric(10,2) not null check (total_price >= 0),
  is_paid boolean not null default false,
  payment_method text check (payment_method in ('pix', 'cash', 'debit_card', 'credit_card', 'terminal')),
  started_at timestamptz default now() not null,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_attendances_updated_at
  before update on attendances
  for each row execute function handle_updated_at();

create table if not exists attendance_items (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid references attendances(id) on delete cascade not null,
  service_id uuid references services(id) on delete restrict not null,
  service_name text not null,
  vehicle_type text not null,
  applied_price numeric(10,2) not null check (applied_price >= 0),
  added_during_service boolean not null default false,
  created_at timestamptz default now() not null
);

-- 2.11 Transações Financeiras (Entradas & Saídas)
create table if not exists financial_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete set null,
  attendance_id uuid references attendances(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(10,2) not null check (amount > 0),
  payment_method text check (payment_method in ('pix', 'cash', 'debit_card', 'credit_card', 'terminal')),
  category text not null,
  description text not null,
  recorded_by_user_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- 2.12 Transações de Pagamento (Payment Layer / Maquininha SmartPOS)
create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete restrict not null,
  attendance_id uuid references attendances(id) on delete restrict not null,
  provider text not null default 'mercadopago',
  external_reference text,
  terminal_id text,
  amount numeric(10,2) not null check (amount > 0),
  method text not null check (method in ('pix', 'cash', 'debit_card', 'credit_card', 'terminal')),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'approved', 'rejected', 'cancelled', 'error')),
  idempotency_key text unique not null,
  metadata jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_payment_transactions_updated_at
  before update on payment_transactions
  for each row execute function handle_updated_at();

-- 2.13 Fidelidade (8 Carimbos e Código Único de Resgate)
create table if not exists loyalty_rewards (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  reward_type text not null check (reward_type in ('cash', 'service')),
  reward_value text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  current_stamps int not null default 0 check (current_stamps >= 0 and current_stamps <= 8),
  total_cycles_completed int not null default 0 check (total_cycles_completed >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (company_id, customer_id)
);

create trigger tr_loyalty_cards_updated_at
  before update on loyalty_cards
  for each row execute function handle_updated_at();

create table if not exists loyalty_redemptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  redemption_code text unique not null,
  is_confirmed boolean not null default false,
  confirmed_at timestamptz,
  confirmed_by_user_id uuid references auth.users(id) on delete set null,
  reward_type text not null,
  description text not null,
  created_at timestamptz default now() not null
);

-- 2.14 Estoque & Solicitações de Reposição
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete cascade not null,
  name text not null,
  current_quantity numeric(10,2) not null default 0 check (current_quantity >= 0),
  unit_of_measure text not null check (unit_of_measure in ('unidade', 'litro', 'kg', 'caixa')),
  minimum_alert_quantity numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger tr_inventory_items_updated_at
  before update on inventory_items
  for each row execute function handle_updated_at();

create table if not exists inventory_replenishment_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  unit_id uuid references units(id) on delete cascade not null,
  item_id uuid references inventory_items(id) on delete cascade not null,
  requested_by_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'fulfilled')),
  notes text,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 3. ÍNDICES DE PERFORMANCE E CONSULTA (DATABASE.md Seção 29)
-- ==============================================================================

create index if not exists idx_profiles_company on profiles(company_id, role);
create index if not exists idx_units_company on units(company_id);
create index if not exists idx_employees_company_unit on employees(company_id, active_unit_id);
create index if not exists idx_customers_company on customers(company_id);
create index if not exists idx_customers_user on customers(user_id);
create index if not exists idx_vehicles_plate on vehicles(company_id, license_plate);
create index if not exists idx_vehicles_customer on vehicles(customer_id);
create index if not exists idx_services_company on services(company_id);
create index if not exists idx_appointments_company_date on appointments(company_id, scheduled_at);
create index if not exists idx_attendances_status on attendances(company_id, status);
create index if not exists idx_financial_occurred on financial_transactions(company_id, occurred_at);
create index if not exists idx_payment_tx_idempotency on payment_transactions(idempotency_key);
create index if not exists idx_loyalty_redemption_code on loyalty_redemptions(redemption_code);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & ISOLAMENTO MULTI-TENANT (SECURITY.md Seção 7)
-- ==============================================================================

-- Função auxiliar STABLE para obter o company_id do usuário autenticado
create or replace function get_auth_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from profiles where id = auth.uid() limit 1;
$$;

-- Função auxiliar para checar se o usuário autenticado é proprietário da empresa
create or replace function is_company_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'owner'
  );
$$;

-- 4.1 Habilitação obrigatória do RLS em todas as tabelas
alter table companies enable row level security;
alter table units enable row level security;
alter table profiles enable row level security;
alter table employees enable row level security;
alter table employee_transfers enable row level security;
alter table customers enable row level security;
alter table vehicles enable row level security;
alter table services enable row level security;
alter table service_prices enable row level security;
alter table appointments enable row level security;
alter table appointment_items enable row level security;
alter table attendances enable row level security;
alter table attendance_items enable row level security;
alter table financial_transactions enable row level security;
alter table payment_transactions enable row level security;
alter table loyalty_rewards enable row level security;
alter table loyalty_cards enable row level security;
alter table loyalty_redemptions enable row level security;
alter table inventory_items enable row level security;
alter table inventory_replenishment_requests enable row level security;

-- 4.2 Políticas de Profiles
create policy "Usuários podem ver seu próprio perfil"
  on profiles for select
  using (id = auth.uid());

create policy "Usuários podem atualizar seu próprio perfil"
  on profiles for update
  using (id = auth.uid());

-- 4.3 Políticas de Isolamento por Empresa (Multi-tenant)
-- Regra básica: Acesso concedido somente se company_id for idêntico ao do usuário autenticado.

-- Companies
create policy "Usuários autenticados podem ver sua empresa"
  on companies for select
  using (id = get_auth_company_id());

create policy "Proprietários podem atualizar sua empresa"
  on companies for update
  using (id = get_auth_company_id() and is_company_owner());

-- Units
create policy "Membros da empresa podem ver unidades"
  on units for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem gerenciar unidades"
  on units for all
  using (company_id = get_auth_company_id() and is_company_owner());

-- Employees & Transfers
create policy "Membros da empresa podem ver funcionários"
  on employees for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem gerenciar funcionários"
  on employees for all
  using (company_id = get_auth_company_id() and is_company_owner());

create policy "Membros da empresa podem ver transferências"
  on employee_transfers for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem registrar transferências"
  on employee_transfers for insert
  with check (company_id = get_auth_company_id() and is_company_owner());

-- Customers & Vehicles
create policy "Membros da empresa podem gerenciar clientes"
  on customers for all
  using (company_id = get_auth_company_id());

create policy "Clientes autenticados podem ver seus próprios dados de cliente"
  on customers for select
  using (user_id = auth.uid());

create policy "Membros da empresa podem gerenciar veículos"
  on vehicles for all
  using (company_id = get_auth_company_id());

create policy "Clientes autenticados podem ver seus próprios veículos"
  on vehicles for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

-- Services & Prices
create policy "Membros e clientes podem ver serviços da empresa"
  on services for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem gerenciar serviços"
  on services for all
  using (company_id = get_auth_company_id() and is_company_owner());

create policy "Membros e clientes podem ver preços dos serviços"
  on service_prices for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem gerenciar preços de serviços"
  on service_prices for all
  using (company_id = get_auth_company_id() and is_company_owner());

-- Appointments & Items
create policy "Membros da empresa podem gerenciar agendamentos"
  on appointments for all
  using (company_id = get_auth_company_id());

create policy "Clientes podem ver seus próprios agendamentos"
  on appointments for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Membros da empresa podem gerenciar itens de agendamento"
  on appointment_items for all
  using (appointment_id in (select id from appointments where company_id = get_auth_company_id()));

-- Attendances & Items (Operação dos 4 status)
create policy "Membros da empresa podem gerenciar atendimentos operacionais"
  on attendances for all
  using (company_id = get_auth_company_id());

create policy "Clientes podem acompanhar o status do seu veículo"
  on attendances for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Membros da empresa podem gerenciar itens do atendimento"
  on attendance_items for all
  using (attendance_id in (select id from attendances where company_id = get_auth_company_id()));

-- Financial Transactions (Restrito ao Proprietário e Gestores autorizados)
create policy "Proprietários podem gerenciar o financeiro"
  on financial_transactions for all
  using (company_id = get_auth_company_id() and is_company_owner());

-- Payment Transactions
create policy "Membros da empresa podem gerenciar transações de pagamento"
  on payment_transactions for all
  using (company_id = get_auth_company_id());

-- Loyalty
create policy "Membros da empresa podem ver e gerenciar fidelidade"
  on loyalty_cards for all
  using (company_id = get_auth_company_id());

create policy "Clientes podem ver seu próprio cartão de fidelidade"
  on loyalty_cards for select
  using (customer_id in (select id from customers where user_id = auth.uid()));

create policy "Membros da empresa podem gerenciar recompensas"
  on loyalty_rewards for all
  using (company_id = get_auth_company_id());

create policy "Clientes podem resgatar recompensas"
  on loyalty_redemptions for all
  using (company_id = get_auth_company_id());

-- Inventory
create policy "Membros da empresa podem gerenciar estoque"
  on inventory_items for all
  using (company_id = get_auth_company_id());

create policy "Funcionários podem criar solicitações de reposição"
  on inventory_replenishment_requests for insert
  with check (company_id = get_auth_company_id());

create policy "Membros da empresa podem ver solicitações de reposição"
  on inventory_replenishment_requests for select
  using (company_id = get_auth_company_id());

create policy "Proprietários podem aprovar ou revisar solicitações"
  on inventory_replenishment_requests for update
  using (company_id = get_auth_company_id() and is_company_owner());

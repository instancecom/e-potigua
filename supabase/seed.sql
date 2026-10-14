-- ==============================================================================
-- e-potiguá - Seed Data para Desenvolvimento e Testes Locais
-- Diretrizes: DATABASE.md (Seção 33) e PRODUCT.md
-- ==============================================================================

-- 1. Criação da Empresa Piloto de Demonstração
insert into companies (id, name, trade_name, slug, subscription_status)
values (
  '11111111-1111-1111-1111-111111111111',
  'Lava Rápido & Estética Potiguá Ltda',
  'Potiguá Auto Care',
  'potigua-autocare',
  'active'
) on conflict (id) do nothing;

-- 2. Criação das Duas Unidades Iniciais de Validação (PRODUCT.md Seção 2)
insert into units (id, company_id, name, address, active_washers_count, opening_time, closing_time, is_active)
values 
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'Unidade 1 - Centro',
  'Av. Principal, 1000 - Centro',
  3,
  '08:00',
  '18:00',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Unidade 2 - Zona Sul',
  'Rua das Palmeiras, 250 - Zona Sul',
  2,
  '08:00',
  '18:00',
  true
) on conflict (id) do nothing;

-- 3. Serviços Iniciais & Preços por Categoria de Veículo (PRODUCT.md Seção 7)
-- 3.1 Serviço: Lavagem Simples (Ducha + Secagem)
insert into services (id, company_id, name, description, is_active)
values (
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  'Lavagem Simples',
  'Lavagem externa da lataria e secagem manual.',
  true
) on conflict (id) do nothing;

insert into service_prices (company_id, service_id, vehicle_type, price, estimated_duration_minutes)
values
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'motorcycle', 25.00, 20),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'hatch', 35.00, 30),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'sedan', 40.00, 35),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'suv', 45.00, 40),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'pickup', 55.00, 45),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'truck', 90.00, 60)
on conflict do nothing;

-- 3.2 Serviço: Lavagem Completa (Externa + Aspiração + Pretinho)
insert into services (id, company_id, name, description, is_active)
values (
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'Lavagem Completa',
  'Lavagem externa, aspiração interna profunda, limpeza de painel e acabamento nos pneus.',
  true
) on conflict (id) do nothing;

insert into service_prices (company_id, service_id, vehicle_type, price, estimated_duration_minutes)
values
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'motorcycle', 40.00, 35),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'hatch', 60.00, 50),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'sedan', 70.00, 55),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'suv', 80.00, 60),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'pickup', 95.00, 70),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'truck', 150.00, 90)
on conflict do nothing;

-- 4. Recompensa de Fidelidade Padrão (PRODUCT.md Seção 19)
insert into loyalty_rewards (id, company_id, reward_type, reward_value, description, is_active)
values (
  '44444444-4444-4444-4444-444444444441',
  '11111111-1111-1111-1111-111111111111',
  'service',
  'Lavagem Completa Grátis',
  'Ganhe 1 Lavagem Completa grátis após completar os 8 carimbos.',
  true
) on conflict (id) do nothing;

-- 5. Itens Iniciais de Estoque (PRODUCT.md Seção 21)
insert into inventory_items (id, company_id, unit_id, name, current_quantity, unit_of_measure, minimum_alert_quantity, is_active)
values
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Shampoo Automotivo Neutro (5L)', 4, 'unidade', 2, true),
  ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Pretinho / Brilha Pneus (5L)', 2, 'unidade', 1, true),
  ('55555555-5555-5555-5555-555555555553', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Cera Líquida de Carnaúba (5L)', 1, 'unidade', 1, true)
on conflict (id) do nothing;

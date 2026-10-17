-- Adiciona função para adicionar serviço a atendimento existente e atualizar valor total
create or replace function add_attendance_service(
  p_attendance_id uuid,
  p_service_id uuid,
  p_price numeric,
  p_unit_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service_name text;
  v_vehicle_type text;
begin
  -- Verifica acesso à unidade (Segurança RLS)
  if not exists (
    select 1 from attendances 
    where id = p_attendance_id and unit_id = p_unit_id
  ) then
    raise exception 'Acesso negado ou atendimento não encontrado.';
  end if;

  -- Busca detalhes do serviço e tipo de veículo do atendimento
  select s.name, v.type 
  into v_service_name, v_vehicle_type
  from attendances a
  join vehicles v on a.vehicle_id = v.id
  join services s on s.id = p_service_id
  where a.id = p_attendance_id;

  -- Insere o item
  insert into attendance_items (attendance_id, service_id, service_name, vehicle_type, applied_price, added_during_service)
  values (p_attendance_id, p_service_id, v_service_name, v_vehicle_type, p_price, true);

  -- Atualiza valor total
  update attendances
  set total_price = total_price + p_price,
      updated_at = now()
  where id = p_attendance_id;
end;
$$;

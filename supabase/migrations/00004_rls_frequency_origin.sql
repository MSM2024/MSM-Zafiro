-- RLS para tablas Frequency Origin

alter table public.frequency_channels enable row level security;
alter table public.nodes enable row level security;
alter table public.frequency_events enable row level security;
alter table public.conversation_state enable row level security;
alter table public.pending_operations enable row level security;

create policy "authenticated_read_frequency_channels"
on public.frequency_channels for select to authenticated using (true);

create policy "owner_insert_frequency_channels"
on public.frequency_channels for insert to authenticated
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'OWNER'));

create policy "authenticated_read_nodes"
on public.nodes for select to authenticated using (true);

create policy "owner_insert_nodes"
on public.nodes for insert to authenticated
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'OWNER'));

create policy "authenticated_insert_frequency_events"
on public.frequency_events for insert to authenticated
with check (auth.uid() = user_id or user_id is null);

create policy "owner_read_frequency_events"
on public.frequency_events for select to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'OWNER'));

create policy "authenticated_read_own_conversation"
on public.conversation_state for select to authenticated
using (user_id = auth.uid());

create policy "authenticated_insert_own_conversation"
on public.conversation_state for insert to authenticated
with check (user_id = auth.uid());

create policy "authenticated_update_own_conversation"
on public.conversation_state for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "authenticated_read_own_pending"
on public.pending_operations for select to authenticated
using (user_id = auth.uid());

create policy "authenticated_insert_own_pending"
on public.pending_operations for insert to authenticated
with check (user_id = auth.uid());

create policy "authenticated_update_own_pending"
on public.pending_operations for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

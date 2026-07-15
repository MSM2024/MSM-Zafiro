# DATABASE AUDIT — Supabase

## Migraciones Existentes
| Archivo | Tablas Creadas | Estado |
|---------|---------------|--------|
| `00001_auth_roles_profiles.sql` | auth.users (extendido), roles, profiles | FUNCIONAL |
| `00002_economia_schema.sql` | economia_operaciones, economia_caja, economia_inventario, frequency_origin_nodes, frequency_channels, guardian_actions, frequency_events + vista_auditoria_economia | FUNCIONAL |
| `00003_frequency_origin.sql` | frequency_channels, nodes, frequency_events, conversation_state, pending_operations | PARCIAL (duplica tablas de 00002) |
| `00004_rls_frequency_origin.sql` | RLS policies para tablas nuevas | FUNCIONAL |

## Problemas Detectados
1. **Tablas duplicadas**: `frequency_channels`, `frequency_origin_nodes`/`nodes`, `frequency_events` aparecen en 00002 y 00003
2. **Sin conexión real**: Supabase configurado pero sin proyecto activo
3. **Sin seed data**: No hay datos de prueba para desarrollo
4. **Sin migraciones de Stripe**: No hay tablas para suscripciones/pagos

## Acción Recomendada
1. Fusionar 00002 y 00003 en una sola migración
2. Agregar migración 00005 para suscripciones (stripe_customers, subscriptions)
3. Agregar seed.sql con datos de prueba
4. Conectar proyecto Supabase real

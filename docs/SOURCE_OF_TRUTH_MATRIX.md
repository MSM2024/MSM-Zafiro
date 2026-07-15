# SOURCE OF TRUTH MATRIX

| Concepto | Fuente Única Propuesta | Estado Actual |
|----------|----------------------|---------------|
| Configuración central | `packages/types/src/zafiro.ts` | Disperso en configs |
| Usuarios | `packages/types/src/zafiro.ts` (ZafiroUser) | AuthUser + ZafiroUser |
| Roles | `supabase/migrations/00001_auth_roles_profiles.sql` | SQL + tipos en auth.ts |
| Permisos | `packages/types/src/zafiro.ts` | No implementado |
| Inventario | `packages/economy/` (propuesto) | `EconomiaService.ts` |
| Caja | `packages/economy/` (propuesto) | `EconomiaService.ts` |
| Ventas | `packages/economy/` (propuesto) | `EconomiaPanel.tsx` localStorage |
| Suscripciones | `src/app/terms/page.tsx` + Stripe | StripeModal simulado |
| Eventos | `packages/events/` | EventBus funcional |
| Guardianes | `packages/guardians/` | GuardianRegistry funcional |
| Conversaciones | `packages/eliana/` | process-message.ts |
| Estado offline | `packages/offline/` | offline-operation.ts |
| Sincronización | `packages/sync/` | SyncEngine + SyncQueue |
| Auditoría | `supabase/migrations/00002_economia_schema.sql` (vista_auditoria_economia) | SQL creada |
| Variables de entorno | `.env.local` + `.env.example` (propuesto) | Solo .env.local |
| Versiones | `ROADMAP.md` + `package.json` | Documentación manual |
| localStorage keys | `src/lib/comentarios.ts` (definición central) | 17 keys dispersas |

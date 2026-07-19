# Documento 5: Inventario de Base de Datos y Almacenamiento

**Repositorio:** https://github.com/MSM2024/MSM-Zafiro.git
**Rama:** `main` | **Commit:** `278b81c`
**Fecha:** 2026-07-17

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Claves localStorage | 60+ |
| Archivos de migración SQL | 11 |
| Tablas SQL definidas | 45+ |
| Supabase configurado | No (0 credenciales) |
| SQL ejecutado en Supabase | No |
| IndexedDB | No utilizado |
| Datos persistentes reales | 0 (todo es efímero) |

---

## 1. Almacenamiento localStorage (60+ claves)

### Autenticación y Sesión
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_users` | `auth.ts` | Usuarios registrados | `ZafiroUser[]` |
| `zafiro_session` | `auth.ts` | Sesión activa | `{ email, name, id }` |
| `zafiro_user_role` | `auth.ts` | Rol del usuario | `"OWNER" \| "CASHIER" \| "VIEWER"` |
| `zafiro_auth_bridge` | `auth-bridge.ts` | Puente entre páginas | Objeto auth |

### Perfiles e Identidad
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_profiles` | `profile.ts` | Perfiles v1 (legacy) | `Record<id, Profile>` |
| `zafiro_v2_profiles` | `identity.ts` | Perfiles v2 | `ProfileV2[]` |
| `zafiro_v2_private` | `identity.ts` | Datos privados | Datos sensibles |
| `zafiro_v2_business` | `identity.ts` | Perfiles negocio | `BusinessProfile[]` |
| `zafiro_v2_business_members` | `identity.ts` | Miembros negocio | `BusinessMember[]` |
| `zafiro_v2_consents` | `identity.ts` | Consentimientos | `ConsentRecord[]` |
| `zafiro_v2_events` | `identity.ts` | Eventos verificación | `VerificationEvent[]` |
| `zafiro_v2_admin_actions` | `identity.ts` | Acciones admin | `AdminAction[]` |
| `zafiro_v2_badges` | `identity.ts` | Insignias | `Badge[]` |
| `zafiro_presencia_instantanea` | `presencia.ts` | Config presencia | `PresenciaConfig` |

### KYC / KYB
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_v2_kyc_cases` | `identity.ts` | Casos KYC | `KYCCase[]` |
| `zafiro_v2_kyc_docs` | `identity.ts` | Documentos KYC | `KYCDocument[]` |
| `zafiro_v2_kyc_reviews` | `identity.ts` | Revisiones KYC | `KYCReview[]` |

### Owner / Seguridad
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_owner_membership` | `owner.ts` | Membresía owner | `OwnerMembership` |
| `zafiro_owner_audit_log` | `owner.ts` | Log auditoría owner | `AuditEntry[]` |
| `zafiro_owner_mfa_active` | `owner.ts` | MFA activo | `"true" \| "false"` |
| `zafiro_owner_devices` | `owner-devices.ts` | Dispositivos registrados | `Device[]` |
| `zafiro_owner_device_events` | `owner-devices.ts` | Eventos dispositivos | `DeviceEvent[]` |
| `zafiro_owner_sync_prefs` | `owner-devices.ts` | Preferencias sync | `SyncPrefs` |
| `zafiro_owner_training_store` | `eliana/owner-firewall.ts` | Store entrenamiento | Objeto |

### Seguridad
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_secure_pin` | `security-lock.ts` | PIN hasheado | SHA-256 hash |
| `zafiro_pin_attempts` | `security-lock.ts` | Intentos PIN | `"0"-"5"` |
| `zafiro_lockout_until` | `security-lock.ts` | Bloqueo temporal | ISO timestamp |
| `zafiro_audit_events` | `security-lock.ts` | Eventos auditoría | `AuditEvent[]` |
| `zafiro_angel_audit` | `angel-security.ts` | Auditoría ángeles | `AngelAudit[]` |
| `zafiro_angel_mfa_devices` | `angel-security.ts` | MFA dispositivos | `MFADevice[]` |
| `zafiro_angel_security_events` | `angel-security.ts` | Eventos seguridad | `SecurityEvent[]` |

### ELIANA
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_eliana_memory` | `eliana/memory.ts` | Memoria conversaciones | `MemoryEntry[]` |
| `zafiro_eliana_graph` | `eliana/knowledge.ts` | Grafo conocimiento | Grafo nodos |
| `zafiro_eliana_feedback` | `eliana/feedback.ts` | Feedback usuarios | `FeedbackEntry[]` |
| `zafiro_eliana_rules` | `eliana/feedback.ts` | Reglas aprendidas | `Rule[]` |
| `zafiro_eliana_traces` | `eliana/correlation.ts` | Trazas correlación | `TraceEntry[]` |
| `zafiro_eliana_analysis` | `eliana/analysis.ts` | Análisis | `AnalysisEntry[]` |
| `zafiro_eliana_knowledge_chunks` | `eliana/knowledge/retrieval.ts` | Chunks conocimiento | `Chunk[]` |
| `zafiro_eliana_knowledge_docs` | `eliana/knowledge/retrieval.ts` | Documentos conocimiento | `Document[]` |
| `zafiro_core_sync_events` | `eliana/core/sync-protocol.ts` | Eventos sync core | `SyncEvent[]` |
| `zafiro_core_agents` | `eliana/core/agent-registry.ts` | Agentes registrados | `Agent[]` |
| `zafiro_core_actions` | `eliana/core/agent-registry.ts` | Acciones agentes | `Action[]` |
| `zafiro_central_rules` | `eliana/core/rules-engine.ts` | Reglas centrales | `Rule[]` |
| `zafiro_recommendations_cache` | `eliana/recommendations.ts` | Cache recomendaciones | `Recommendation[]` |

### Económico
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_ledger_maestro` | `ledger.ts` | Ledger maestro | `LedgerEntry[]` |
| `zafiro_ledger_cierres` | `ledger.ts` | Cierres diarios | `DailyClose[]` |
| `zafiro_bpa_balance` | `bpa-mirror.ts` | Balance BPA | `Balance` |
| `zafiro_bpa_transfers` | `bpa-mirror.ts` | Transferencias BPA | `Transfer[]` |
| `zafiro_cripto_activos` | `cripto-activos.ts` | Activos cripto | `PlataformaCripto[]` |
| `zafiro_contenedores` | `logistica-contenedores.ts` | Contenedores | `Contenedor[]` |
| `zafiro_trusted_clients` | `cliente-confiable.ts` | Clientes confiables | `ClienteConfiable[]` |
| `zafiro_memoria_eterna` | `cliente-confiable.ts` | Memoria eterna cliente | `MemoriaEterna` |
| `zafiro_firmas_369` | `firma-369.ts` | Firmas digitales 369 | `Firma369[]` |
| `zafiro_ratings` | `ratings.ts` | Ratings | `Rating[]` |
| `zafiro_impacto_social` | `impacto-social.ts` | Impacto social | `MisionSocial` |

### Financiamiento
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_funding_campaigns` | `financiamiento.ts` | Campañas | `Campaign[]` |
| `zafiro_funding_contributions` | `financiamiento.ts` | Contribuciones | `Contribution[]` |
| `zafiro_funding_expenses` | `financiamiento.ts` | Gastos | `Expense[]` |
| `zafiro_funding_allocations` | `financiamiento.ts` | Asignaciones | `Allocation[]` |
| `zafiro_funding_audit` | `financiamiento.ts` | Auditoría financiera | `AuditEntry[]` |

### Membresías
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_user_memberships` | `memberships.ts` | Membresías usuario | `Membership[]` |
| `zafiro_membership_events` | `memberships.ts` | Eventos membresía | `MembershipEvent[]` |
| `zafiro_stripe_customers` | `memberships.ts` | Clientes Stripe | `StripeCustomer[]` |

### Contenido
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_sponsors` | `zafiro-data.ts` | Sponsors | `Sponsor[]` |
| `zafiro_questions` | `zafiro-data.ts` | Preguntas | `Question[]` |
| `zafiro_comentarios` | `comentarios.ts` | Comentarios | `Comentario[]` |
| `zafiro_publicaciones` | `comentarios.ts` | Publicaciones | `Publicacion[]` |
| `zafiro_seals` | `seals-data.ts` | Sellos | `Seal[]` |
| `zafiro_seal_progress` | `seals-data.ts` | Progreso sellos | `SealProgress[]` |
| `zafiro_seal_favorites` | `seals-data.ts` | Favoritos sellos | `SealFavorite[]` |
| `zafiro_seal_journal` | `seals-data.ts` | Diario espiritual | `JournalEntry[]` |
| `zafiro_reading_plan` | `seals-data.ts` | Plan lectura | `ReadingPlan` |
| `zafiro_today_seal` | `seals-data.ts` | Sello del día | `Seal` |
| `zafiro_knowledge_base` | `import-whatsapp-knowledge.ts` | Knowledge importado | `KnowledgeEntry[]` |
| `zafiro_marketing_assets` | `marketing.ts` | Assets marketing | `MarketingAsset[]` |

### Directorio / Omnicanal
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_directorio` | `eliana/omnicanal.ts` | Directorio contactos | `DirectorioEntry[]` |
| `zafiro_expedientes` | `eliana/omnicanal.ts` | Expedientes | `Expediente[]` |
| `zafiro_inventario_movimientos` | `eliana/omnicanal.ts` | Inventario | `Movimiento[]` |

### Familia
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_reunion_guests` | `familia.ts` | Invitados reunión | `Guest[]` |
| `zafiro_family_photos` | `familia.ts` | Fotos familiares | `Photo[]` |
| `zafiro_family_stories` | `familia.ts` | Historias familiares | `Story[]` |

### Villa Esperanza
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_villa_phases` | `villa-esperanza.ts` | Fases proyecto | `Phase[]` |
| `zafiro_villa_contributions` | `villa-esperanza.ts` | Contribuciones | `Contribution[]` |

### Email
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_email_outbox` | `email-service.ts` | Bandeja email simulada | `EmailMessage[]` |

### Legal
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_legal_docs` | `legal/terms-engine.ts` | Documentos legales | `LegalDoc[]` |
| `zafiro_legal_audit` | `legal/terms-engine.ts` | Auditoría legal | `AuditEntry[]` |

### Offline
| Clave | Módulo | Propósito | Formato |
|-------|--------|-----------|---------|
| `zafiro_offline_{tabla}` | `FrequencyOriginService.ts` | Cola offline por tabla | `OfflineEntry[]` |

---

## 2. Migraciones Supabase (11 archivos)

### `00001_auth_roles_profiles.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `profiles`, `audit_logs`, `referrals`, `rewards_log`
**Enums:** `user_role` (OWNER, CASHIER, VIEWER)
**RLS:** Habilitado con políticas por usuario
**Triggers:** Auto-crear perfil al registrarse

### `00002_economia_schema.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `frequency_origin_nodes`, `frequency_channels`, `guardian_actions`, `frequency_events`, `economia_operaciones`, `economia_caja`, `economia_inventario`
**Vistas:** `vista_auditoria_economia`
**Seed:** Nodo frecuencia_origen, canales (WiFi 5.6, LoRa, BLE, GPS)

### `00003_frequency_origin.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `frequency_channels` (schema diferente a 00002), `nodes`, `frequency_events`, `conversation_state`, `pending_operations`
**Nota:** Conflicto potencial con 00002 (misma tabla `frequency_channels`)

### `00003_seals_module.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `seals`, `user_seal_progress`, `seal_favorites`, `seal_journal_entries`, `seal_comments`, `seal_reactions`, `seal_shares`, `reading_plans`, `user_streaks`
**RLS:** 13 políticas detalladas
**Índices:** 8 índices para performance
**Triggers:** Auto-update `updated_at`

### `00004_rls_frequency_origin.sql`
**Estado:** Nunca ejecutada
**Propósito:** RLS para tablas de frequency_origin

### `00005_identity_system.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `profiles_v2`, `profile_private_data`, `kyc_cases`, `kyc_documents`, `kyc_provider_sessions`, `kyc_reviews`, `business_profiles`, `business_members`, `beneficial_owners`, `consent_records`, `verification_events`, `profile_badges`, `admin_actions`
**Enums:** `user_role`, `membership_tier`, `verification_status`, `risk_level`, `vip_status`, `account_status`, `badge_type`
**RLS:** 14 políticas
**Triggers:** 5 triggers de `updated_at`

### `00006_family_cloud.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `family_trees`, `family_members`, `family_relationships`, `family_events`, `family_photos`, `family_photo_people`, `family_stories`, `family_documents`, `family_audio`, `family_video`, `reunions`, `reunion_guests`, `reunion_schedule`, `reunion_messages`, `reunion_contributions`, `invitations`, `family_audit_logs`
**Seed:** Reunión "Gran Encuentro Familiar Soria Martinez" — 16 agosto 2026

### `00007_exchange_rates.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `exchange_rate_snapshots`
**Seed:** Tasas elTOQUE + BCC + CADECA (USD/EUR vs CUP, julio 2026)

### `00008_owner_profiles.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `owner_profiles`, `owner_audit_log`, `owner_sessions`
**Seed:** Auto-insertar owner para `com8msm@gmail.com`
**RLS:** Políticas owner-only
**Triggers:** Audit automático en updates

### `00009_owner_devices.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `owner_devices`, `device_sync_events`, `owner_sync_preferences`
**RLS:** Owner-only para dispositivos propios

### `00010_profiles_memberships_stripe.sql`
**Estado:** Nunca ejecutada
**Tablas creadas:** `profiles`, `profile_roles`, `membership_plans`, `user_memberships`, `stripe_customers`, `stripe_subscriptions`, `membership_events`
**Seed:** 3 planes (Free, Pro $9.99/mo, Cuba Plus $14.99/mo)
**RLS:** 7 políticas con helper `is_admin()`
**Nota:** Conflicto con 00001 (misma tabla `profiles`)

---

## 3. Estado de la Conexión a Base de Datos

| Componente | Estado | Detalle |
|------------|--------|---------|
| **Supabase URL** | No configurado | `NEXT_PUBLIC_SUPABASE_URL` sin valor real |
| **Supabase Anon Key** | No configurado | `NEXT_PUBLIC_SUPABASE_ANON_KEY` sin valor real |
| **Service Role Key** | No configurado | `SUPABASE_SERVICE_ROLE_KEY` sin valor real |
| **Proyecto Supabase** | No creado | No hay instancia activa |
| **SQL ejecutado** | 0 migraciones | Ninguna migración aplicada |
| **RLS activo** | No | No hay tablas en Supabase |
| **Auth real** | No | Todas las auth routes usan fallback localStorage |
| **IndexedDB** | No utilizado | No hay código IndexedDB |
| **SQLite** | No | Solo se usa `pgcrypto` en SQL |

---

## 4. Análisis de Riesgo

### Riesgo Crítico
- **Toda la data es efímera**: Se pierde al borrar caché del navegador
- **No hay respaldo**: Sin Supabase, no hay backup de datos de usuarios
- **Sin autenticación real**: Las contraseñas se hashean localmente con salt fijo (`zafiro_salt_v1`)
- **Sin RLS**: No hay protección a nivel de base de datos
- **Credenciales expuestas**: `VERCEL_OIDC_TOKEN` presente en `.env.local`

### Riesgo Alto
- **Migraciones incompatibles**: 00001 y 00010 ambas crean tabla `profiles` con esquemas diferentes
- **Migraciones duplicadas**: 00002 y 00003 ambos definen `frequency_channels` con schema diferente
- **60+ claves localStorage**: Sin validación de esquema, fácil corrupción
- **Sin tipado runtime**: No hay validación Zod/io-ts en localStorage

### Riesgo Medio
- **Sin sync multi-device**: Cada navegador tiene datos independientes
- **Sin logout real**: La sesión se borra de localStorage pero la cookie de Supabase (si existiera) persiste
- **PIN hasheado con salt fijo**: Vulnerable a rainbow table si se expone localStorage

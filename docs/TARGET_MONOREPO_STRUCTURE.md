# TARGET MONOREPO STRUCTURE — ZAFIRO

## Principios
1. Mantener la estructura actual de Next.js App Router como base
2. Consolidar packages/ como la fuente de toda la lógica de negocio
3. src/ solo contiene páginas, componentes UI y configuración de Next.js
4. Un solo tipos compartido, un solo event bus, un solo auth

## Estructura Propuesta

```
msm-zafiro/
├── packages/
│   ├── types/          ← Tipos centrales (ZafiroUser, ZafiroEvent, etc.)
│   ├── config/         ← Configuración central (frecuencia origen, economía, etc.)
│   ├── auth/           ← Autenticación (Supabase SSR + localStorage dual)
│   ├── events/         ← ZafiroEventBus (único bus de eventos)
│   ├── guardians/      ← 7 Guardianes (definiciones + validación)
│   ├── eliana/         ← ELIANA orchestrator (procesamiento de mensajes)
│   ├── economy/        ← MSM Economía (operaciones, caja, inventario)
│   ├── marketplace/    ← MSM Marketplace (futuro)
│   ├── offline/        ← Offline Core (operaciones pendientes, IndexedDB)
│   ├── sync/           ← Sync Engine (cola, backoff, reconciliación)
│   ├── whatsapp/       ← WhatsApp client + formato visual
│   ├── mesh-bridge/    ← Mesh network (BroadcastChannel, BLE, LoRa)
│   ├── adaptive-router/ ← Router adaptativo por score de canal
│   ├── digital-twin/   ← Modelo de gemelo digital
│   └── portable-eliana/ ← Paquete portable con firma
│
├── apps/
│   ├── web/ ← (actual src/app/ — mover aquí si se separa, mantener en raíz por ahora)
│   │   ├── app/        ← 39 rutas Next.js
│   │   ├── components/ ← UI components
│   │   └── lib/        ← Utilidades específicas de la web
│
├── supabase/
│   ├── migrations/     ← Migraciones SQL (4 existentes)
│   ├── functions/      ← Edge Functions (futuro)
│   └── seed/           ← Seed data (futuro)
│
├── services/
│   ├── sync-service/   ← Servicio de sincronización (futuro)
│   ├── audit-service/  ← Servicio de auditoría (futuro)
│   └── backup-service/ ← Servicio de backup (futuro)
│
├── tests/
│   ├── unit/           ← Tests unitarios
│   ├── integration/    ← Tests de integración
│   └── e2e/            ← Tests end-to-end
│
├── docs/               ← Documentación
├── public/             ← Assets estáticos
└── scripts/            ← Scripts de build/utilidad
```

## Notas de migración
- La estructura actual (src/app/ en raíz) funciona con Next.js y no requiere cambio inmediato
- Los packages/ ya existen, solo requieren consolidación de código duplicado
- services/ es para servicios backend separados (futuro)
- Se recomienda mover src/ a apps/web/ SOLO cuando haya múltiples apps

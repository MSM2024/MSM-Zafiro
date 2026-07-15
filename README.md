# ZAFIRO — MSM Economía

Sistema Operativo de Microrredes Inteligentes (MSM) para la economía cubana. Arquitectura modular, offline-first, con ELIANA como asistente central.

## Stack

- **Runtime**: Node.js 20+, Next.js 16 (App Router, `'use client'`)
- **UI**: Tailwind CSS v4, `motion/react`, `lucide-react`
- **Database**: Supabase (PostgreSQL) + localStorage fallback
- **Auth**: Supabase SSR + localStorage dual
- **Payments**: Stripe (planes Pro / Cuba+)
- **PWA**: Service Worker + manifest.webmanifest
- **AI**: ELIANA — orquestador basado en Gemini API

## Estructura

```
packages/
  types/          — Tipos centrales ZAFIRO
  frequency-origin/ — Nudo Único Frecuencia Origen
  guardians/      — Registro de 7 Guardianes
  events/         — Bus de eventos ZafiroEventBus
  eliana/         — Procesador de mensajes ELIANA
  whatsapp/       — Formato visual WhatsApp
  offline/        — Tipos de operación offline
  sync/           — Cola de sincronización con backoff
  digital-twin/   — Modelo de gemelo digital (nodos)
  mesh-bridge/    — Bridge de malla (WiFi/BLE/LoRa/sat)
  adaptive-router/ — Router adaptativo por score
  portable-eliana/ — Paquete portable ELIANA con firma
src/
  app/            — 33 rutas estáticas + 3 dinámicas
  lib/            — Servicios (Economía, Frecuencia Origen, etc.)
  components/     — UI components (ElianaAvatar, EconomiaPanel, etc.)
```

## Comandos

```bash
npm run dev              # Desarrollo en :3001
npm run build            # Build producción
npm run lint             # ESLint
npm run build:packages   # Build packages (opcional)
```

## Despliegue

- Vercel: `msm-zafiro` → https://msm-zafiro.vercel.app
- Dominio: `msmmystore.com` (proyecto `msm`)
- Rama prod: `main`
- Rama dev: `integration/msm-master-molecule`

## Licencia

MSM MY STORE LLC — Todos los derechos reservados.

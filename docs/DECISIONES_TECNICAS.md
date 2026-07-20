# Decisiones Técnicas — MSM ZAFIRO

## Arquitectura

### Por qué Next.js App Router
- SSR/SSG/ISR según ruta sin cambiar framework
- API Routes integradas (sin backend separado)
- Turbopack para dev rápido
- File-based routing sin config adicional

### Por qué localStorage (no Supabase aún)
- Sin credenciales Supabase disponibles
- localStorage es síncrono, simple, disponible offline
- Transición planeada: localStorage → indexedDB → Supabase
- Todas las funciones tienen try/catch para SSR safety

### Por qué sin `next/image`
- Las imágenes vienen de Unsplash URLs externas
- `next/image` requiere dominio configurado y puede romper en build
- Se usa `<img>` raw con lazy loading nativo

## Decisiones por Fase

### Fase 1 — Social
- **Feed**: `lib/feed.ts` puro con localStorage. Sin DB. Paginación client-side con slice.
- **Q&A**: Modelo plano (pregunta → respuestas en array). No normalizado por simplicidad.
- **Círculos**: Invites por código para círculos privados (no real-time, no websockets).
- **Mensajería**: Polling manual (3s). Sin WebSocket. Datos por conversación en clave separada `zafiro_msg_{convId}`.
- **Perfiles unificados**: Redirect 301 via `redirect()` en page component. No se eliminaron las rutas viejas por compatibilidad.

### Fase 3 — Marketplace
- **Stores**: `lib/marketplace-stores.ts` separado de `marketplace.ts` para evitar acoplamiento.
- **Variantes**: `VariantGroup[]` en el Producto. Cada opción con priceAdjustment y stockOverride. Sin SKU generation.
- **Vendor Panel**: Datos calculados en tiempo real (stats desde getStores + getOrders). Sin caché.
- **Delivery Evidence**: Foto + nota como string fields en la Store. Sin CDN.

### Fase 4 — Offline-First
- **Queue**: `QueueItem[]` en localStorage clave única. Estados: local → pending → syncing → confirmed → failed.
- **Sync Engine**: Handler registry pattern. Cada entidad registra su función de sync. Sin cola de prioridades.
- **Conflict Strategy**: `local_wins` por defecto. `remote_wins` y `manual` definidos en tipos pero no implementados.
- **Indicator**: Componente flotante con polling (5s). Sin push nativo.

### Fase 5 — Points
- **PTS engine**: `rewards.ts` con daily limits por acción vía `DailyAction[]` fechados. Streak basado en fecha ISO.
- **MSM Coin**: Solo tipos e interfaces. `msm-coin.ts` con wallet vacía. Sin transacciones reales, sin blockchain, sin contrato.
- **Badge PTS**: Estado en ZafiroShell se carga una vez al mount. Sin polling.

## Convenciones de Código

- `'use client'` en todas las páginas y componentes interactivos
- `usePageTitle("Name")` para SEO titles
- localStorage keys prefixed `zafiro_`
- try/catch en todas las lecturas de localStorage (SSR safety)
- Path alias `@/*` → `./src/*`
- Iconos: `lucide-react`. Animaciones: `motion/react`
- CSS: Tailwind dark theme (`#050816` bg, `#00D9FF` accent)

## Deuda Técnica / Mejoras Futuras

1. Migrar localStorage a IndexedDB (mejor performance para datos grandes)
2. Agregar `next/image` con dominio Unsplash configurado
3. WebSocket para mensajería en tiempo real
4. Server-side validation con API routes
5. Tests (0 tests en todo el proyecto)
6. i18n (todo en español por ahora)
7. PWA service worker con cache strategies reales
8. MSM Mesh Android (repo independiente)

# ZAFIRO Velocidad Luz 369/777 — Sistema de Optimización

## Principio 369

| Capa | Estrategia | Descripción |
|------|-----------|-------------|
| **3 Capas** | Local → Edge → Origen | Carga progresiva desde localStorage → Service Worker → Red |
| **6 Estrategias** | Comprimir / Cachear / Bajo Demanda / Progresivo / Solo Cambios / Adaptativo | Cada recurso se sirve con la estrategia óptima según modo |
| **9 Métricas** | TTFB / FCP / LCP / INP / CLS / JS Inicial / Peso Página / Latencia API / Tasa Errores | Medición continua con budgets configurables |

## Protocolo 777

| Regla | Descripción |
|-------|-------------|
| **7 Reglas de Carga** | Esencial primero / Diferir módulos / Lazy images / ELIANA bajo demanda / Sin duplicados / Prefetch crítico / Prioridad por interacción |
| **7 Modos de Respaldo** | Caché local / Texto sin imágenes / Baja resolución / Animaciones reducidas / Offline queue / Degradación graceful / Pantalla offline |
| **7 Pruebas** | Rápida / Fast 3G / Slow 3G / Alta latencia / Pérdida paquetes / Offline / Recursos limitados |

## Modos de Red

| Modo | Display | Prioridad | Caché | Imágenes | Módulos | Sync | Uso típico |
|------|---------|-----------|-------|----------|---------|------|------------|
| `LIGHT` | Ahorro | Esencial | Agresivo | Placeholder | Críticos | Diferida | Slow 3G / Datos limitados |
| `BALANCED` | Equilibrado | Normal | Medio | Lazy + WebP | Priorizados | Programada | 4G / WiFi regular |
| `FULL` | Completo | Normal | Bajo | Alta resolución | Todos | Inmediata | WiFi / 5G |
| `OFFLINE` | Sin conexión | Sin red | Solo local | Sin carga | Mínimos | En cola | Sin internet |

## Arquitectura

```
src/lib/performance/
├── network-mode.ts        → Detección automática + selector manual
├── connection-monitor.ts  → Muestreo cada 30s, historial, reportes
├── request-cache.ts       → Cache con stale-while-revalidate, TTL por prefix
├── adaptive-loader.ts     → Registro de módulos, carga por prioridad+modo
├── sync-engine.ts         → Cola de operaciones offline, checksum, idempotencia
└── performance-budget.ts  → 8 budgets LCP/INP/CLS/TTFB/FCP/LCP+TTFB/JS/Peso
```

## Componentes UI

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `NetworkModeIndicator` | Footer / Admin | Selector manual Auto/Ahorro/Completo |
| `AdaptiveImage` | Reemplazo de `<img>` | Lazy loading + placeholder según modo |
| `DeferredModule` | Wrapper de módulos | Carga diferida por prioridad+modo |
| `OfflineStatus` | Fixed bottom | Indicador offline + botón sincronizar |

## Budgets de Rendimiento

| Métrica | Objetivo | Unidad |
|---------|----------|--------|
| LCP | ≤2500 | ms |
| INP | ≤200 | ms |
| CLS | ≤0.1 | score |
| TTFB | ≤800 | ms |
| FCP | ≤1800 | ms |
| LCP con TTFB | ≤3300 | ms |
| JS inicial | ≤170 | KB |
| Peso página | ≤1000 | KB |

## Almacenamiento Local

| Key | Propósito |
|-----|-----------|
| `zafiro_network_mode` | Preferencia manual de modo |
| `zafiro_connection_samples` | Historial de muestras de conexión |
| `zafiro_cache_*` | Entradas de caché por prefix |
| `zafiro_sync_queue` | Cola de operaciones offline |
| `zafiro_budget_history` | Historial de evaluaciones de presupuesto |

# ZAFIRO Performance Budgets — Guía de Medición

## Cómo Medir

### Automático (Recomendado)
1. Ir a `/admin/rendimiento`
2. Pestaña **Presupuestos**
3. Click **MEDIR AHORA**
4. Resultado: PASS / PARTIAL / FAIL por cada métrica

### Manual
```js
import { runBudgetCheck } from '@/lib/performance/performance-budget'
const result = await runBudgetCheck(window.location.href, 'FULL')
console.log(result.overall) // 'pass' | 'partial' | 'fail'
```

## Interpretación de Resultados

| Resultado | Significado | Acción |
|-----------|-------------|--------|
| ✅ PASS | Todas las métricas dentro del budget | Mantener |
| ⚠️ PARTIAL | Algunas métricas excedidas | Revisar entradas fail |
| ❌ FAIL | Métricas críticas excedidas | Optimizar inmediatamente |

## Escenarios de Prueba

### Slow 3G (LIGHT mode)
- LCP esperado: ≤4000ms
- FCP esperado: ≤3000ms
- JS inicial: ≤100KB
- Imágenes: placeholders

### 4G (BALANCED mode)
- LCP esperado: ≤2500ms
- FCP esperado: ≤1800ms
- Caché: media

### WiFi (FULL mode)
- LCP esperado: ≤1800ms
- FCP esperado: ≤1200ms
- Sin restricciones

## Budgets por Modo

| Modo | LCP | INP | CLS | TTFB | FCP | JS | Peso |
|------|-----|-----|-----|------|-----|----|------|
| LIGHT | 4000ms | 300ms | 0.15 | 1500ms | 3000ms | 100KB | 500KB |
| BALANCED | 2500ms | 200ms | 0.1 | 800ms | 1800ms | 170KB | 1000KB |
| FULL | 1800ms | 150ms | 0.08 | 500ms | 1200ms | 250KB | 1500KB |
| OFFLINE | — | — | — | — | — | 50KB | 200KB |

## Historial

La función `getBudgetHistory()` retorna todas las mediciones guardadas en `zafiro_budget_history`. Cada entrada contiene:
- `timestamp`: ISO string
- `networkMode`: Modo al medir
- `overall`: pass/partial/fail
- `failures`: Lista de métricas fallidas
- `entries`: Detalle por métrica

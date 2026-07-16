# GUARDIÁN 5 — Código y Cadena de Suministro: Auditoría

**Fecha:** 2026-07-15

---

## Resultados de Escaneo

### npm audit

```
2 moderate severity vulnerabilities
  - postcss <8.5.10 (via next dependency)
  - Fix: npm audit fix --force (instalaría next@9.3.3 — NO RECOMENDADO)
```

**Decisión:** No corregir automáticamente. La vulnerabilidad está en postcss (dependencia indirecta de Next.js 16.2.10). Next.js lo parcheará en una versión futura. El riesgo es moderado y afecta el stringify de CSS.

### ESLint (npm run lint)

| Tipo | Cantidad |
|------|----------|
| Errors | 36 |
| Warnings | 187 |

**Errores principales:**
- `react-hooks/set-state-in-effect` — 4 archivos (trading, EconomiaPanel, ElianaAvatar, PresenciaInstantanea)
- `react-hooks/purity` (Math.random en render) — GalaxiaInfinita.tsx
- `@typescript-eslint/no-explicit-any` — 6 archivos (HoloCinemaCanvas, EconomiaService, trading, presencia, trading-strategy)
- `react-hooks/immutability` — GalaxiaInfinita.tsx (modificar uniforms en useFrame)

**Warnings principales:**
- `@typescript-eslint/no-unused-vars` — +100 ocurrencias en toda la base
- `@next/next/no-img-element` — 20+ ocurrencias (usar `<Image>` de next/image)
- `react-hooks/exhaustive-deps` — varias dependencias faltantes

### Build

✅ **0 errores** — 50 rutas compiladas correctamente

---

## Controles de Cadena de Suministro

| Control | Estado | Nota |
|---------|--------|------|
| Branch protection | ❌ FAIL | No configurado en GitHub |
| PR obligatorios | ❌ FAIL | No configurado |
| Revisión obligatoria | ❌ FAIL | No configurado |
| Status checks | ❌ FAIL | No configurado |
| Secret scanning | ❌ FAIL | No activado en GitHub |
| Push protection | ❌ FAIL | No activado |
| Dependabot | ❌ FAIL | No configurado |
| Code scanning | ❌ FAIL | No configurado |
| Lockfile | ✅ PASS | `package-lock.json` presente |
| Versiones fijadas | ⚠️ PARCIAL | Next.js 16.2.10 fija, otras con ^ |
| Audit scripts postinstall | ❌ FAIL | No auditado |
| SBOM | ❌ FAIL | No generado |
| Commits pequeños/reversibles | ✅ PASS | Historial con commits atómicos |

---

## Recomendaciones

1. **Activar branch protection** en GitHub para `integration/msm-master-molecule`
2. **Requerir PRs** con mínimo 1 approval para merge
3. **Activar secret scanning** y push protection en GitHub
4. **Configurar Dependabot** para alertas automáticas de seguridad
5. **Corregir los 36 errores de lint** — prioridad: errors de setState-in-effect
6. **Reemplazar `<img>` por `<Image />`** de next/image en componentes clave
7. **Generar SBOM** periódicamente: `npm sbom`

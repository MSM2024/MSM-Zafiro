# Broken Assets Report — ZAFIRO OS

**Date:** 2026-07-15

---

## Broken Assets

| Asset | Location | Issue | Severity |
|-------|----------|-------|----------|
| Profile avatar (default) | `src/app/page.tsx:679` | Hardcoded Unsplash URL — no local fallback | ⚠️ Medium |
| Profile cover (default) | `src/lib/profile.ts:30` | Empty string `""` → broken `<img>` | ⚠️ Medium |
| Profile avatar (default) | `src/lib/profile.ts:180` | Empty string `""` → broken `<img>` | ⚠️ Medium |

---

## Missing Local Files

The following paths are referenced in `ZAFIRO_ASSETS` config but have no actual files yet:

| Path | Status |
|------|--------|
| `/assets/zafiro/logos/zafiro-logo.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/branding/zafiro-nucleo-principal.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/avatars/eliana-avatar-dorado.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/seasonal/feliz-ano-nuevo-zafiro.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/guardians/guardian-seguridad.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/villa-esperanza/villa-esperanza-portada.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/backgrounds/zafiro-bg-default.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/banners/zafiro-banner-main.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/marketplace/msm-marketplace-default.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/msm-economia/msm-economia-default.webp` | ❌ Not created (placeholder) |
| `/assets/zafiro/social/zafiro-social-default.webp` | ❌ Not created (placeholder) |

---

## Unresolved External Dependencies

20 Unsplash URLs will break if Unsplash changes CDN or rate-limits:

| Photo ID | Files |
|----------|-------|
| `photo-1451187580459-43490279c0fa` | `zafiro-data.ts` |
| `photo-1472099645785-5658abf4ff4e` | `zafiro-data.ts` |
| `photo-1494790108377-be9c29b29330` | `zafiro-data.ts` |
| `photo-1500648767791-00dcc994a43e` | `zafiro-data.ts` |
| `photo-1507003211169-0a1dd7228f2d` | `zafiro-data.ts` |
| `photo-1519085360753-af0119f7cbe7` | `zafiro-data.ts` |
| `photo-1530026405186-ed1ea0ac7a63` | `zafiro-data.ts` |
| `photo-1535713875002-d1d0cf377fde` | `page.tsx` |
| `photo-1544005313-94ddf0286df2` | `zafiro-data.ts` |
| `photo-1544716278-ca5e3f4abd8c` | `comentarios.ts` |
| `photo-1555664424-778a1e5e1b48` | `zafiro-data.ts` |
| `photo-1555939594-58d7cb561ad1` | `comentarios.ts` |
| `photo-1576086213369-97a306d36557` | `zafiro-data.ts` |
| `photo-1580519542036-c47de6196ba5` | `comentarios.ts` |
| `photo-1590283603385-17ffb3a7f29f` | `zafiro-data.ts` |
| `photo-1596462502278-27bfdc403348` | `comentarios.ts` |
| `photo-1611162616475-46b635cb6868` | `comentarios.ts` |
| `photo-1614741118887-7a4ee193a5fa` | `zafiro-data.ts` |
| `photo-1618005182384-a83a8bd57fbe` | `zafiro-data.ts`, `page.tsx` |
| `photo-1639322537228-f710d846310a` | `zafiro-data.ts` |

---

## Recommendations

1. Download all 20 Unsplash images to `public/assets/zafiro/unsplash/`
2. Create placeholder SVG files for missing `ZAFIRO_ASSETS` paths
3. Add fallback logic for profile avatar/cover empty strings
4. Migrate all `<img>` tags to `next/image`
5. Set up the validation script as a pre-commit hook

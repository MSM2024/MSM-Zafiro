# ZAFIRO Image Audit Report

**Date:** 2026-07-15
**Auditor:** OpenCode
**Project:** zafiro-os-1-0-0

---

## Summary

| Metric | Value |
|--------|-------|
| Total local image files | 9 (8 SVG + 1 ICO) |
| Raster images (PNG/JPG/WebP) | 0 |
| External image URLs (Unsplash) | 20 unique / 33 total references |
| Unused public files | 5 |
| Local paths (C:\, Desktop, localhost) | 0 |
| Mixed content (HTTP images in HTTPS) | 0 |
| Profile images with empty src | 2 fields |
| `next/image` usage | None (all raw `<img>`) |
| Git-ignored images | None |

---

## Files in `public/`

| File | Status |
|------|--------|
| `eliana-diamond.svg` | ✅ Used (PWA manifest) |
| `icons/icon-192.svg` | ✅ Used (layout.tsx, manifest, SW) |
| `icons/icon-512.svg` | ✅ Used (manifest, SW) |
| `file.svg` | ❌ UNUSED (Next.js default) |
| `globe.svg` | ❌ UNUSED (Next.js default) |
| `next.svg` | ❌ UNUSED (Next.js default) |
| `vercel.svg` | ❌ UNUSED (Next.js default) |
| `window.svg` | ❌ UNUSED (Next.js default) |
| `favicon.ico` | ✅ Used (src/app/) |

---

## External Image Dependencies (Unsplash)

All raster images come from 20 Unsplash URLs hardcoded in:
- `src/lib/zafiro-data.ts` (26 occurrences)
- `src/lib/comentarios.ts` (5 occurrences)
- `src/app/page.tsx` (2 occurrences)

**Risk:** These URLs may change, rate-limit, or break. No local fallbacks exist.

---

## Issues Found

### Critical
- **No local raster images** — the app depends entirely on Unsplash CDN
- **Profile images default to empty `src=""`** in `profile.ts` → broken `<img>` tags
- **No `next/image` component** — no optimization, lazy loading, or responsive images

### Warning
- **5 unused SVG files** — should be removed to avoid confusion
- **No `alt` text on some images** — accessibility issue
- **No image size attributes** — layout shift possible

### Info
- No local paths (C:\, Desktop, localhost, blob:) detected
- No mixed content (all external images use HTTPS)
- No image-related git-ignore exclusions

---

## Recommendations

1. Download and migrate all Unsplash images to `public/assets/zafiro/`
2. Replace hardcoded Unsplash URLs with `ZAFIRO_ASSETS` references
3. Use `next/image` for optimization
4. Add fallback placeholder images for profile fields
5. Remove unused SVG files (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)

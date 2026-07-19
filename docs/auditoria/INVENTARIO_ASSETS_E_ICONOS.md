# Documento 7: Inventario de Assets e Iconos

**Repositorio:** https://github.com/MSM2024/MSM-Zafiro.git
**Rama:** `main` | **Commit:** `278b81c`
**Fecha:** 2026-07-17

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Archivos en `public/` | 6 (3 SVG + 1 ICO + 2 manifest/SW) |
| Imágenes WebP locales | 15 |
| PNG/JPG locales | 0 |
| SVGs de Next.js (defaults) | 5 (eliminados en working tree) |
| URLs Unsplash externas | 20+ |
| Entradas `ZAFIRO_ASSETS` | 14 |
| Uso de `next/image` | Ninguno |

---

## 1. Archivos Públicos (`/public/`)

| Archivo | Estado | Uso |
|---------|:------:|-----|
| `public/eliana-diamond.svg` | ✅ Usado | PWA manifest, logo de app |
| `public/icons/icon-192.svg` | ✅ Usado | `layout.tsx`, manifest, Service Worker |
| `public/icons/icon-512.svg` | ✅ Usado | manifest, Service Worker |
| `public/favicon.ico` | ✅ Usado | `<link rel="icon">` en `src/app/` |
| `public/manifest.json` | ✅ Usado | PWA manifest |
| `public/manifest.webmanifest` | ✅ Usado | PWA manifest alternativo |
| `public/sw.js` | ✅ Usado | Service Worker |

### SVGs de Next.js (eliminados)
| Archivo | Estado | Nota |
|---------|:------:|------|
| `public/file.svg` | ❌ Eliminado | Default Next.js, no usado |
| `public/globe.svg` | ❌ Eliminado | Default Next.js, no usado |
| `public/next.svg` | ❌ Eliminado | Default Next.js, no usado |
| `public/vercel.svg` | ❌ Eliminado | Default Next.js, no usado |
| `public/window.svg` | ❌ Eliminado | Default Next.js, no usado |

---

## 2. Assets WebP (`/public/assets/zafiro/`)

### Avatares (8 archivos)
| Archivo | Dimensiones | Uso |
|---------|------------|-----|
| `avatars/eliana-gema-telefono-holografico.webp` | 610×1080 | Hero móvil ELIANA |
| `avatars/eliana-ascension-red-de-nodos.webp` | 608×1080 | Animación sincronización |
| `avatars/eliana-origen-modulos-superiores.webp` | 810×1080 | Cabecera paneles |
| `avatars/eliana-zafiro-destino-gema-telefono.webp` | 720×1080 | Hero alternativo |
| `avatars/eliana-interfaz-manos-telefono.webp` | 720×1280 | Pantalla bienvenida |
| `avatars/eliana-modulos-destino-poster.webp` | 853×1280 | Poster móvil/redes |
| `avatars/eliana-origen-panel-de-modulos.webp` | 853×1280 | Pantalla Origen |
| `avatars/eliana-modulos-zafiro-destino.webp` | 720×1080 | Hero principal módulos |

### Branding (3 archivos)
| Archivo | Dimensiones | Uso |
|---------|------------|-----|
| `branding/zafiro-gema-azul-fondo-oscuro.webp` | 1080×1080 | Icono principal, carga |
| `branding/zafiro-eliana-protegidas-por-el-senor.webp` | 720×1080 | Portada espiritual |
| `branding/zafiro-logo-gema-geometria-sagrada.webp` | 1080×540 | Logo horizontal |

### Conceptos (3 archivos)
| Archivo | Dimensiones | Uso |
|---------|------------|-----|
| `conceptos/incubadora-del-futuro-angel-gema.webp` | 720×1080 | Sección Incubadora |
| `conceptos/zafiro-dashboard-desktop-concept.webp` | 1280×720 | Referencia escritorio |
| `conceptos/zafiro-dashboard-mobile-concept.webp` | 720×1280 | Referencia móvil |

### Storyboards (1 archivo)
| Archivo | Dimensiones | Uso |
|---------|------------|-----|
| `storyboards/eliana-awakening-storyboard.webp` | 1080×720 | Storyboard despertar ELIANA |

### Subdirectorios Vacíos (creados pero sin archivos)
| Directorio | Contenido |
|------------|-----------|
| `backgrounds/` | Vacío |
| `banners/` | Vacío |
| `guardians/` | Vacío |
| `icons/` | Vacío |
| `logos/` | Vacío |
| `marketplace/` | Vacío |
| `msm-economia/` | Vacío |
| `seasonal/` | Vacío |
| `social/` | Vacío |
| `villa-esperanza/` | Vacío |

---

## 3. Manifest `ZAFIRO_ASSETS`

**Archivo:** `src/config/zafiro-assets.ts`

14 entradas registradas con metadatos completos:

```typescript
ZAFIRO_ASSETS = {
  zafiro_eliana_protegidas_por_el_senor → branding (720×1080)
  zafiro_gema_azul_fondo_oscuro → branding (1080×1080)
  eliana_gema_telefono_holografico → avatar (610×1080)
  incubadora_del_futuro_angel_gema → concepto (720×1080)
  eliana_modulos_zafiro_destino → avatar (720×1080)
  zafiro_logo_gema_geometria_sagrada → branding (1080×540)
  eliana_ascension_red_de_nodos → avatar (608×1080)
  eliana_origen_modulos_superiores → avatar (810×1080)
  eliana_zafiro_destino_gema_telefono → avatar (720×1080)
  eliana_interfaz_manos_telefono → avatar (720×1280)
  eliana_modulos_destino_poster → avatar (853×1280)
  eliana_origen_panel_de_modulos → avatar (853×1280)
  zafiro_dashboard_desktop_concept → concepto (1280×720)
  zafiro_dashboard_mobile_concept → concepto (720×1280)
  eliana_awakening_storyboard → storyboard (1080×720)
}
```

Cada entrada incluye: `src`, `alt`, `width`, `height`, `usage`.

---

## 4. Uso de Assets en Código

### `src/lib/zafiro-data.ts`
Importa `ZAFIRO_ASSETS` y crea constantes:
```typescript
const AVATAR_B = ZAFIRO_ASSETS.eliana_modulos_zafiro_destino.src
const AVATAR_F = ZAFIRO_ASSETS.eliana_zafiro_destino_gema_telefono.src
const BRAND_IMG = ZAFIRO_ASSETS.zafiro_gema_azul_fondo_oscuro.src
const BRAND_WIDE = ZAFIRO_ASSETS.zafiro_eliana_protegidas_por_el_senor.src
const CONCEPT_DESK = ZAFIRO_ASSETS.zafiro_dashboard_desktop_concept.src
const CONCEPT_MOB = ZAFIRO_ASSETS.zafiro_dashboard_mobile_concept.src
const LOGO_GEMA = ZAFIRO_ASSETS.zafiro_logo_gema_geometria_sagrada.src
```

### `src/lib/comentarios.ts`
Usa `ZAFIRO_ASSETS` para imágenes de publicaciones seed.

### `public/manifest.json`
```json
{ "icons": [
  { "src": "/icons/icon-192.svg", "sizes": "192x192" },
  { "src": "/icons/icon-512.svg", "sizes": "512x512" }
]}
```

### `src/app/layout.tsx`
```html
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/icons/icon-192.svg" />
```

---

## 5. Formatos de Imagen

| Formato | Cantidad | Local | Externo |
|---------|:--------:|:-----:|:-------:|
| SVG | 3 | ✅ | 0 |
| ICO | 1 | ✅ | 0 |
| WebP | 15 | ✅ | 0 |
| PNG | 0 | 0 | 0 |
| JPG/JPEG | 0 | 0 | 0 |
| GIF | 0 | 0 | 0 |
| Unsplash URLs | 20+ | 0 | ✅ |

---

## 6. Problemas Encontrados

### Críticos
- **Sin `next/image`**: Ninguna imagen usa el componente optimizado de Next.js
  - Sin lazy loading automático
  - Sin responsive images (srcset)
  - Sin optimización de formato (WebP/AVIF on-the-fly)
  - Sin placeholder blur
  - Sin lazy boundary
- **Profile images con `src=""`**: `profile.ts` puede retornar avatar con string vacío → `<img src="">` roto
- **0 imágenes raster locales (PNG/JPG)**: Solo WebP; sin compatibilidad universal

### Altos
- **Favicon ICO, no SVG**: No se adapta a diferentes densidades de píxel
- **Sin Apple Touch Icon proper**: Usa `icon-192.svg` que puede no funcionar en todos los iOS
- **Sin Windows tile icons**: No hay `browserconfig.xml` ni tiles de 70×70, 150×150, 310×310
- **Sin splash screens**: No hay imágenes de splash para PWA en iOS/Android

### Medios
- **10 subdirectorios vacíos**: `backgrounds/`, `banners/`, `guardians/`, `icons/`, `logos/`, `marketplace/`, `msm-economia/`, `seasonal/`, `social/`, `villa-esperanza/` — creados pero sin contenido
- **5 SVGs de Next.js eliminados**: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — limpieza correcta
- **Sin alt text en todas las imágenes**: Algunas imágenes Unsplash no tienen `alt` descriptivo
- **Sin atributos de tamaño**: Las `<img>` directas no declaran `width`/`height` → layout shift posible

### Informativos
- **20+ URLs Unsplash hardcoded**: Dependencia externa sin fallback
- **Imágenes en `zafiro-data.ts`**: Datos mock usan tanto locales (`ZAFIRO_ASSETS`) como externas (Unsplash)
- **Todas las imágenes son served desde `public/`**: Sin CDN propio, sin cache headers configurados

---

## 7. Recomendaciones

1. **Migrar a `next/image`** para todas las imágenes — obtiene optimización, lazy loading, y responsive automático
2. **Completar migración Unsplash→local** — descargar todas las 20+ URLs restantes a `public/assets/zafiro/`
3. **Crear favicon SVG** — más legible en alta resolución que ICO
4. **Generar Apple Touch Icons** — 180×180 PNG para iOS
5. **Generar Windows tiles** — 70×70, 150×150, 310×310 + `browserconfig.xml`
6. **Crear splash screens** — para PWA en iOS y Android
7. **Limpiar subdirectorios vacíos** o poblarlos con assets pendientes
8. **Agregard fallback para avatar vacío** — usar iniciales o placeholder por defecto
9. **Eliminar dependencia Unsplash** — completamente local y controlado

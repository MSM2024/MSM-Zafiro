# New Design Asset Map

**Date:** 2026-07-15
**Status:** Structure created — waiting for approved images from Don Miguel

---

## Directory Structure

```
public/assets/zafiro/
├── branding/          # Core brand assets (nucleo, gradients)
├── logos/             # ZAFIRO logos (main, icon, variations)
├── backgrounds/       # Background textures, patterns, gradients
├── avatars/           # ELIANA avatar, user default avatars
├── guardians/         # 7 archangels / spiritual guardians
├── banners/           # Hero banners, section headers
├── marketplace/       # MSM Marketplace product images
├── msm-economia/      # MSM Economy dashboard images
├── villa-esperanza/   # Social impact project images
├── social/            # Social platform connection images
├── seasonal/          # Seasonal/holiday assets
└── icons/             # Custom icons not in lucide-react
```

---

## Asset Map (ZAFIRO_ASSETS)

```typescript
export const ZAFIRO_ASSETS = {
  // Core Branding
  logo: "/assets/zafiro/logos/zafiro-logo.webp",
  core: "/assets/zafiro/branding/zafiro-nucleo-principal.webp",

  // Avatars
  eliana: "/assets/zafiro/avatars/eliana-avatar-dorado.webp",
  elianaDiamond: "/eliana-diamond.svg",

  // PWA / Icons
  icon192: "/icons/icon-192.svg",
  icon512: "/icons/icon-512.svg",
  favicon: "/favicon.ico",

  // Seasonal
  newYear: "/assets/zafiro/seasonal/feliz-ano-nuevo-zafiro.webp",

  // Guardians
  guardians: {
    seguridad: "/assets/zafiro/guardians/guardian-seguridad.webp",
  },

  // Projects
  villaEsperanza: {
    portada: "/assets/zafiro/villa-esperanza/villa-esperanza-portada.webp",
  },

  // Backgrounds
  backgrounds: {
    default: "/assets/zafiro/backgrounds/zafiro-bg-default.webp",
  },

  // Banners
  banners: {
    main: "/assets/zafiro/banners/zafiro-banner-main.webp",
  },

  // Marketplace
  marketplace: {
    default: "/assets/zafiro/marketplace/msm-marketplace-default.webp",
  },

  // Economy
  economia: {
    default: "/assets/zafiro/msm-economia/msm-economia-default.webp",
  },

  // Social
  social: {
    default: "/assets/zafiro/social/zafiro-social-default.webp",
  },
};
```

---

## Image-to-Section Mapping

| Section | Asset Key | Status |
|---------|-----------|--------|
| Home SPA | `logo` | ⏳ Waiting for image |
| ELIANA Chat | `eliana` | ⏳ Waiting for image |
| Galaxia Infinita | `backgrounds.default` | ⏳ Waiting for image |
| Impacto Social | `villaEsperanza.portada` | ⏳ Waiting for image |
| Admin | `banners.main` | ⏳ Waiting for image |
| Marketplace | `marketplace.default` | ⏳ Waiting for image |
| MSM Economy | `economia.default` | ⏳ Waiting for image |
| Profile | `social.default` | ⏳ Waiting for image |
| Seasonal | `newYear` | ⏳ Waiting for image |
| PWA icons | `icon192`, `icon512` | ✅ Ready (SVG) |
| Favicon | `favicon` | ✅ Ready (ICO) |
| Eliana Diamond | `elianaDiamond` | ✅ Ready (SVG) |

---

## Naming Convention

All new assets must follow:
- lowercase
- no spaces (use hyphens)
- no accents/tildes
- webp format (preferred) or svg

Examples: `zafiro-nucleo-principal.webp`, `eliana-avatar-dorado.webp`

---

## Next Steps

1. ✅ Directory structure created
2. ✅ Asset config created at `src/config/zafiro-assets.ts`
3. ⏳ Approve and upload new images from Don Miguel
4. ⏳ Migrate `<img>` references to use `ZAFIRO_ASSETS`
5. ⏳ Test all images on mobile + desktop

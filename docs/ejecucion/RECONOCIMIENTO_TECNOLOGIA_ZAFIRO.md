# RECONOCIMIENTO_TECNOLOGIA_ZAFIRO

## Mapa de reutilización para Biblioteca Viva + Perfil Autor

### Estado: 2026-07-18
### Auditoría: OpenCode

---

## 1. Tecnología existente que se reutiliza DIRECTAMENTE

| Módulo ZAFIRO | Uso en Biblioteca Viva | Archivos | Estado |
|---------------|------------------------|----------|--------|
| **Autenticación local** | Control de acceso a borradores, roles autor/lector | `src/lib/auth.ts` | ✅ Funcional (localStorage) |
| **Perfiles v2 (identity)** | Extender `Profile` con campos de autor: `biography`, `publicHandle` | `src/lib/identity.ts` | ✅ Funcional, 2 perfiles existentes |
| **Owner profile** | Don Miguel como autor único; `bootstrapOwnerProfile()` reconoce `com8msm@gmail.com` | `src/lib/owner.ts`, `src/lib/identity.ts` | ✅ Funcional, 4 badges |
| **ELIANA Knowledge System** | RAG pipeline completo: chunking, almacenamiento, búsqueda por keywords, 8 categorías, 35 documentos | `src/lib/eliana/knowledge/` (5 archivos) | ✅ Reutilizable para indexar libros |
| **Importación de conocimiento** | JSON import con detección de conflictos, secret scanning, approve/reject | `src/app/admin/knowledge-import/page.tsx` | ✅ Reutilizable para importar libros |
| **File upload (FileReader)** | Carga de portadas, avatares, imágenes — patrón `readAsDataURL()` → localStorage | `src/app/profile-page/`, `src/app/familia/galeria/` | ✅ 4 implementaciones existentes |
| **PWA / Service Worker** | Caché offline, shell estático, fallback `/offline` | `public/sw.js`, `public/manifest.webmanifest` | ✅ Cache-first para lectura offline |
| **Almacenamiento offline** | `zafiro_offline_*` keys, IndexedDB (EconomiaService) | `src/lib/FrequencyOriginService.ts` | ✅ Patrón probado |
| **Rate limiting persistente** | Control de acceso a contenido premium | `src/lib/analytics/rate-limiter.ts` | ✅ localStorage persistente |
| **Auditoría append-only** | Registro de eventos: publicación, revisión, cambios | `src/lib/identity.ts` (events, admin_actions) | ✅ Append-only, max 500 |
| **Diseño dark UI** | Mobile-first: `#050816`, accent `#00D9FF`, Geist font | `tailwind.config.ts`, `globals.css` | ✅ Consistente en toda la app |
| **Motion animations** | Transiciones, slides, fade in/out | `motion/react` en toda la app | ✅ Instalado y usado |
| **Membresías** | Control de acceso a contenido premium por tier | `src/lib/memberships.ts` | ✅ 7 estados, localStorage |
| **OS App Shell** | Dock, launcher, grid de apps — incluye tile "Editorial" | `src/components/os/` | ✅ Ya enlaza a `/ecosystem` |

---

## 2. Tecnología NO disponible (bloqueada)

| Sistema | Bloqueo | Impacto en Biblioteca Viva |
|---------|---------|---------------------------|
| **Supabase Auth** | Sin credenciales | No hay auth real, sesiones server-side, RLS, ni JWT |
| **Supabase DB** | Sin credenciales | No hay PostgreSQL para libros, capítulos, notas, progreso |
| **Supabase Storage** | Sin credenciales | No hay almacenamiento de archivos PDF/EPUB en la nube |
| **Supabase RLS** | Sin credenciales | No hay seguridad a nivel de fila para libros privados |
| **AI Providers** | Sin keys (Gemini, OpenAI, Anthropic) | ELIANA no puede sintetizar respuestas sobre libros |
| **Stripe Live** | Sin claves reales | No hay venta de libros ni membresías premium reales |

**Estrategia:** Todo se construye con localStorage y FileReader, con migración SQL preparada para cuando Supabase esté disponible.

---

## 3. Lo que NO existe y hay que crear

| Componente | Prioridad | Dependencias |
|------------|-----------|-------------|
| Tipos Book, Chapter, Bookmark, ReadingProgress | P0 | `packages/types/src/zafiro.ts` |
| BibliotecaStorage (CRUD localStorage) | P0 | `src/lib/biblioteca/storage.ts` |
| Importador de libros (texto plano) | P0 | FileReader + chunker de knowledge |
| Página Biblioteca en perfil de Don Miguel | P0 | Ruta nueva `/zafiro/biblioteca` |
| Lector de capítulos con progreso | P0 | Componente LectorInteligente |
| Marcadores y notas | P0 | localStorage, mismo patrón que customProjects |
| Sección AUTOR en perfil público | P1 | Extender perfil/[username] |
| AudioLibro (TTS) | P2 | Web Speech API |
| Conector ELIANA → contenido del libro | P1 | knowledge system + nueva categoría LIBRO |
| Migración SQL para Supabase | P0 | `supabase/migrations/00011_biblioteca_zafiro.sql` |

---

## 4. Flujo completo del libro (estados)

```
SUBIDO ──→ VALIDADO ──→ ESTRUCTURADO ──→ EN_REVISION ──→ APROBADO ──→ PUBLICADO
  │            │              │                │              │
  └── rechazado               └── reemplazar   └── corregir   └── ARCHIVADO
```

Cada transición se registra en `zafiro_v2_events` (auditoría append-only existente).

---

## 5. Stack elegido para la implementación

- **Frontend**: Next.js 15 App Router, 'use client'
- **Estilos**: Tailwind + `#050816` / `#00D9FF`
- **Animación**: motion/react
- **Iconos**: lucide-react (ya instalados: `BookOpen`, `BookMarked`, `BookText`, `FileText`, `Headphones`, `Search`, `Plus`, `Check`, `Lock`)
- **Almacenamiento**: localStorage (claves `zafiro_biblioteca_*`)
- **Importación**: `<input type="file" accept=".txt,.md">` + FileReader
- **Chunking**: Misma función `chunkText()` de `src/lib/eliana/knowledge/chunker.ts`
- **Auditoría**: `recordEvent()` de `src/lib/identity.ts`
- **Membresías**: `getActiveMembership()` para contenido premium
- **Audio**: Web Speech API (`SpeechSynthesisUtterance`)
- **PWA offline**: Service Worker cache-first para capítulos leídos

---

## 6. Conexión con ELIANA

Cuando un libro está PUBLICADO:
1. Se agrega como `KnowledgeDocument` con categoría `LIBRO`
2. Cada capítulo se chunkiza con `chunker.ts` (max 1800 chars, 100 overlap)
3. ELIANA puede responder preguntas sobre el libro citando capítulo y sección
4. Se respeta `answer-validator.ts` para no alterar ni atribuir frases fuera del texto aprobado
5. El prompt de ELIANA inyecta: "Basado en el libro [título], capítulo [n], específicamente..."

# MAPA_MODULO_LIBRO

## Biblioteca Viva ZAFIRO — Arquitectura y componentes

---

## 1. Estructura de archivos

```
src/
├── lib/biblioteca/
│   ├── types.ts              # Book, Chapter, Bookmark, ReadingProgress, BookStatus
│   ├── storage.ts            # CRUD localStorage (libros, capítulos, progreso, marcadores)
│   ├── importador.ts         # Importación de .txt/.md → Book + Chapters
│   └── eliana-bridge.ts      # Conexión con knowledge system de ELIANA
├── components/biblioteca/
│   ├── BookCard.tsx           # Tarjeta de libro (portada, título, autor, estado, progreso)
│   ├── BookList.tsx           # Grid/lista de libros
│   ├── ChapterList.tsx        # Tabla de contenidos con progreso
│   ├── LectorInteligente.tsx  # Lector de capítulos con marcadores, notas, progreso
│   ├── BookmarkButton.tsx     # Agregar/quitar marcador
│   ├── NoteDialog.tsx         # Diálogo de notas por capítulo
│   ├── ProgressBar.tsx        # Barra de progreso de lectura
│   ├── AudioReader.tsx        # TTS con Web Speech API
│   ├── ImportDialog.tsx       # Diálogo de importación con preview
│   ├── ReviewWorkflow.tsx     # Workflow de revisión (SUBIDO→VALIDADO→...→PUBLICADO)
│   └── AuthorSection.tsx      # Sección AUTOR en perfil público
├── app/zafiro/biblioteca/
│   ├── page.tsx               # Biblioteca personal (todos los libros)
│   ├── [bookId]/page.tsx      # Vista de libro individual + lector
│   └── layout.tsx             # Layout compartido con navegación
├── app/zafiro/autor/
│   └── page.tsx               # Perfil de autor (Don Miguel)
└── app/api/biblioteca/
    └── import/route.ts        # API para importación (opcional, para server)
```

---

## 2. Flujo de datos

### Importación de libro
```
input[type=file] (.txt/.md)
  → FileReader.readAsText()
  → ImportDialog.tsx (preview: título, capítulos, lineas)
  → Importador.importBook(name, content)
    → Crea Book con status='SUBIDO'
    → Chunkiza contenido en Chapter[] usando chunker.ts
    → Guarda en localStorage (zafiro_biblioteca_libros, zafiro_biblioteca_capitulos)
    → Registra evento 'LIBRO_SUBIDO' en auditoría
  → Redirige a /zafiro/biblioteca/[bookId]
```

### Ciclo de revisión
```
SUBIDO → VALIDADO → ESTRUCTURADO → EN_REVISION → APROBADO → PUBLICADO
Owner aprueba con botón → ReviewWorkflow.tsx
  → Actualiza Book.status
  → Si PUBLICADO: conecta con ELIANA knowledge system
```

### Lectura
```
/zafiro/biblioteca/[bookId]/capitulo/[chapterIndex]
  → LectorInteligente carga Chapter.content
  → Muestra progreso (chapterIndex / totalChapters)
  → Botones: marcador, nota, audio, anterior/siguiente
  → Guarda progreso en zafiro_biblioteca_progreso (cada 5 seg)
```

### ELIANA bridge
```
Libro PUBLICADO
  → eliana-bridge.ts
    → addKnowledgeDocument(titulo, contenido, 'LIBRO')
    → Cada capítulo como chunk independiente con metadata { bookId, chapterIndex, chapterTitle }
  → ELIANA puede responder: "En el capítulo 3 de [libro], Don Miguel explica que..."
  → answer-validator.ts bloquea: no alterar, no atribuir fuera del texto
```

---

## 3. Tipos de datos

```typescript
type BookStatus = 'SUBIDO' | 'VALIDADO' | 'ESTRUCTURADO' | 'EN_REVISION' | 'APROBADO' | 'PUBLICADO' | 'ARCHIVADO'

interface Book {
  id: string
  title: string
  authorName: string
  coverColor: string
  description: string
  biography: string
  isbn?: string
  format: 'txt' | 'md' | 'pdf' | 'docx' | 'epub'
  status: BookStatus
  chapterCount: number
  currentChapterIndex: number
  currentChapterId?: string
  copyright: string
  rightsReserved: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface Chapter {
  id: string
  bookId: string
  index: number
  title: string
  content: string
  wordCount: number
  createdAt: string
}

interface Bookmark {
  id: string
  bookId: string
  chapterId: string
  chapterIndex: number
  label: string
  location: number  // character offset
  createdAt: string
}

interface ReadingNote {
  id: string
  bookId: string
  chapterId: string
  chapterIndex: number
  text: string
  location: number  // character offset
  color: string
  createdAt: string
}

interface ReadingProgress {
  bookId: string
  currentChapterId: string
  currentChapterIndex: number
  scrollPosition: number
  completedChapters: string[]
  lastReadAt: string
  totalReadingTimeMs: number
}
```

---

## 4. localStorage keys

| Clave | Contenido | Tamaño estimado |
|-------|-----------|-----------------|
| `zafiro_biblioteca_libros` | `Book[]` | ~1KB/libro |
| `zafiro_biblioteca_capitulos` | `Chapter[]` | ~5-50KB/libro |
| `zafiro_biblioteca_marcadores` | `Bookmark[]` | ~0.5KB/libro |
| `zafiro_biblioteca_notas` | `ReadingNote[]` | ~1KB/libro |
| `zafiro_biblioteca_progreso` | `Record<bookId, ReadingProgress>` | ~0.5KB/libro |

---

## 5. Integración con perfil de Don Miguel

La sección AUTOR se muestra en:
1. `/zafiro/biblioteca` — Biblioteca personal con todos los libros (admin)
2. `/perfil/[username]` — Sección "Obras publicadas" si el perfil tiene libros PUBLICADO
3. `/zafiro/autor` — Perfil de autor dedicado

Don Miguel se identifica por `isOwnerEmail()` + `isOwner()` + badges `FUNDADOR` + `IDENTIDAD_VERIFICADA`.

---

## 6. Conexiones con módulos existentes

| Módulo existente | Conexión | Archivo |
|------------------|----------|---------|
| Auditoría append-only | Cada transición de estado registra `VerificationEvent` | `src/lib/identity.ts` |
| ELIANA Knowledge | Libros PUBLICADOS se chunkizan y agregan como `KnowledgeDocument` categoría `LIBRO` | `src/lib/eliana/knowledge/retrieval.ts` |
| Chunker | Reutiliza `chunkText()` de knowledge system para dividir capítulos | `src/lib/eliana/knowledge/chunker.ts` |
| Membresías | `getActiveMembership()` para contenido premium por tier | `src/lib/memberships.ts` |
| Rate limiter | Control de acceso a borradores no aprobados | `src/lib/analytics/rate-limiter.ts` |
| Owner MFA | Confirmación de acciones críticas (PUBLICAR, ARCHIVAR) | `src/lib/owner.ts` |
| PWA SW | Capítulos leídos en caché para lectura offline | `public/sw.js` |
| Perfil público | Sección AUTOR se inyecta en `perfil/[username]/page.tsx` | `src/app/perfil/[username]/page.tsx` |

# Módulo: Los 150 Sellos de los Salmos

## Arquitectura

### Rutas
| Ruta | Descripción |
|------|-------------|
| `/sellos` | Portada + grilla visual de 150 sellos |
| `/sellos/[numero]` | Página individual de cada sello |
| `/sellos/aleatorio` | Redirige a un sello aleatorio |
| `/sellos/hoy` | Redirige al sello del día |
| `/sellos/favoritos` | Lista de favoritos |
| `/sellos/diario` | Diario espiritual privado |
| `/admin/sellos` | Panel editorial (solo msmmystore@gmail.com) |

### Componentes
- `src/components/sellos/SealCard.tsx` — Tarjeta de sello para grillas
- `src/components/sellos/SealVisualGrid.tsx` — Mapa visual de 150 celdas

### Capa de datos
- `src/lib/seals-data.ts` — Tipos, seed data (10 sellos), localStorage persistence

### Integración ELIANA
- Cada sello tiene enlace a `/eliana?context=sello-{numero}`
- ELIANA responde con el prompt base de LOS 150 SELLOS DE LOS SALMOS

### Variables de entorno (ya configuradas)
- Ninguna nueva necesaria para el MVP

### Supabase (futuro)
- Migración SQL: `supabase/migrations/00003_seals_module.sql`
- 9 tablas con RLS, índices y triggers

### Diseño
- Dark theme `#050816`, accent `#00D9FF`, dorado para completados
- Modo oración (solo versículo + declaración + oración)
- Modo estudio (contexto académico del salmo)

## Datos demo
- 10 sellos iniciales (Salmo 1 al 10) con contenido real basado en RVR1960
- Temas cubiertos: Dirección, Confianza, Protección, Paz, Batalla espiritual, Adoración, Justicia

## Próximos pasos (FASE 2-4)
1. Poblar sellos 11-150 con contenido verificado
2. Plan de lectura de 150 días con rachas y notificaciones
3. Búsqueda inteligente con filtros temáticos
4. Audio (narración del versículo, reflexión, declaración, oración)
5. Tarjetas visuales para compartir (OG image por sello)
6. Comunidad — comentarios, testimonios, reacciones
7. Notificaciones push diarias
8. Moléculas de conocimiento interconectadas
9. App móvil + WhatsApp/Telegram

# Arquitectura tecnica

## 1. Objetivo

Construir Zafiro, una red social global de conocimiento + IA, mobile first, bilingue desde el primer dia, preparada para crecer desde un MVP hasta cientos de millones de usuarios sin reescribir el sistema.

Esta red social forma parte del Ecosistema MSM. Debe usar una cuenta compartida, autenticacion compartida, pagos compartidos, IA compartida y una infraestructura comun con Album de la Vida, MSM Mente Maestra y MSM Marketplace. Ver [Arquitectura oficial del Ecosistema MSM](msm-ecosystem-architecture.md).

La experiencia principal debe ser tan simple como hacer una pregunta:

1. El usuario escribe una pregunta.
2. La IA responde inmediatamente.
3. La comunidad aporta, corrige, vota y comenta.
4. Expertos verifican o perfeccionan la respuesta.
5. El conocimiento queda versionado, traducido, indexado y reutilizable.

## 2. Principios de arquitectura

- Modularidad: cada dominio principal vive separado y puede evolucionar sin romper el resto.
- Escalabilidad progresiva: empezar con Supabase y Vercel sin cerrar el camino hacia servicios especializados.
- Event driven: las acciones importantes generan eventos para IA, traduccion, reputacion, notificaciones, moderacion y analitica.
- API first: toda capacidad importante debe poder usarse desde web, mobile, PWA, API publica y futuros agentes.
- Seguridad por defecto: RLS, auditoria, permisos por rol y validacion estricta de entradas.
- Internacionalizacion nativa: preguntas, respuestas, categorias y busqueda deben soportar multiples idiomas desde el modelo de datos.
- Conocimiento versionado: las respuestas importantes no se sobrescriben sin historial.
- Observabilidad desde el inicio: logs, metricas, trazas, auditoria y alertas.

## 3. Stack recomendado

### Frontend

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- shadcn/ui o componentes propios sobre Radix UI
- next-intl para i18n
- TanStack Query para estado remoto cuando haga falta
- Zustand para estado local complejo
- PWA con service worker y push notifications

### Backend inicial

- Next.js Route Handlers y Server Actions para MVP
- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime para actividad en preguntas
- Supabase Storage o Cloudflare R2 para archivos
- Edge Functions o workers para tareas asincronas pequenas

### Backend escalable

Cuando el trafico crezca, extraer dominios de mayor carga a servicios independientes:

- AI Orchestrator Service
- Search Service
- Notification Service
- Reputation Service
- Moderation Service
- Translation Service
- Analytics/Event Pipeline
- Public API Gateway

### Infraestructura

- Vercel para frontend y rutas edge
- Supabase para Auth, Postgres, Realtime y storage inicial
- Cloudflare para DNS, CDN, WAF, rate limiting y R2
- Upstash Redis o Redis administrado para cache, colas ligeras y rate limits
- OpenAI para IA generativa, embeddings, resumen, traduccion y clasificacion
- GitHub Actions para CI/CD
- Sentry para errores
- OpenTelemetry para trazas
- PostHog o similar para analitica de producto

## 4. Monorepo sugerido

```text
apps/
  web/                  Next.js app publica y PWA
  admin/                Panel interno de moderacion, soporte y operaciones
  api/                  API publica futura si se separa de Next.js

packages/
  ui/                   Sistema de diseno compartido
  config/               ESLint, TypeScript, Tailwind, Prettier
  db/                   Tipos, migraciones, clientes y queries compartidas
  auth/                 Helpers de permisos, roles y sesiones
  ai/                   Prompts, providers, evaluaciones y orquestacion
  i18n/                 Mensajes, locales y utilidades de traduccion
  validation/           Schemas Zod compartidos
  observability/        Logging, tracing y metricas

services/
  workers/              Jobs asincronos iniciales
  search/               Indexacion y busqueda avanzada futura
  notifications/        Push, email, in-app y digest
  reputation/           Calculo de reputacion e insignias

supabase/
  migrations/
  seed.sql
  policies/

docs/
  architecture.md
  domain-model.md
  roadmap.md
```

## 5. Dominios principales

### Identidad y perfiles

Responsable de autenticacion, sesiones, perfiles publicos, especialidades, verificacion, reputacion base, seguidores y privacidad.

Capacidades:

- Login con Google, Apple, Microsoft, GitHub y email.
- Perfil publico multilingue.
- Roles: usuario, experto, moderador, admin, organizacion.
- Verificacion por especialidad.
- Seguimiento de usuarios, expertos y organizaciones.

### Preguntas

Centro del producto. Toda publicacion nace como pregunta, debate, encuesta, idea, invento, problema, proyecto o investigacion.

Capacidades:

- Crear pregunta con idioma detectado.
- Clasificar categoria, etiquetas e intencion.
- Asociar respuesta inicial de IA.
- Seguir pregunta.
- Marcar pregunta como abierta, resuelta, en debate o archivada.
- Versionar cambios importantes.

### Respuestas y conocimiento

Responsable de respuestas de IA, respuestas humanas, comentarios, ediciones, validaciones y versionado.

Capacidades:

- Respuesta inicial de IA.
- Respuestas humanas.
- Ediciones colaborativas con historial.
- Validacion por expertos.
- Resumen canonico por pregunta.
- Diferentes niveles de explicacion: simple, tecnico, paso a paso.

### IA

Orquesta tareas de inteligencia artificial sin acoplar la app a un unico proveedor.

Capacidades:

- Responder preguntas.
- Generar resumen canonico.
- Traducir contenido.
- Buscar y citar fuentes cuando corresponda.
- Comparar respuestas.
- Explicar facil o tecnico.
- Generar codigo.
- Crear imagenes.
- Clasificar categoria, riesgo, idioma y calidad.
- Moderar contenido.

Diseno recomendado:

- Crear una capa `AIProvider` con adaptadores.
- Guardar prompts versionados.
- Registrar input, output, modelo, costo, latencia y evaluacion.
- Usar colas para tareas no bloqueantes.
- Cachear respuestas y traducciones.

### Comunidad

Responsable de participacion social.

Capacidades:

- Comentarios.
- Votos.
- Guardados.
- Compartidos.
- Seguimiento de preguntas, categorias y expertos.
- Reportes.
- Ediciones sugeridas.

### Reputacion

Sistema de confianza que premia conocimiento util, validado y colaborativo.

Factores:

- Calidad de respuestas.
- Votos positivos ponderados.
- Validaciones de expertos.
- Correcciones aceptadas.
- Fuentes aportadas.
- Consistencia en una especialidad.
- Penalizaciones por spam, plagio o baja calidad.

### Moderacion y seguridad

Capacidades:

- Moderacion automatica por IA.
- Reportes comunitarios.
- Revision humana.
- Rate limiting por usuario, IP, pais y accion.
- Deteccion de spam, abuso, bots y manipulacion de votos.
- Auditoria de cambios sensibles.

### Busqueda

La busqueda debe ser inteligente desde el MVP.

Fases:

1. Postgres full-text search.
2. Embeddings con pgvector.
3. Ranking hibrido: texto, semantica, reputacion, frescura y validacion.
4. Servicio dedicado con OpenSearch, Meilisearch, Typesense o similar si el volumen lo exige.

### Internacionalizacion

Capacidades:

- UI inicial en espanol e ingles.
- Deteccion automatica de idioma.
- Traducciones por contenido.
- Agrupacion de preguntas equivalentes entre idiomas.
- Busqueda cross-language.
- Mostrar contenido en el idioma preferido del usuario.

### Notificaciones

Tipos:

- In-app.
- Push PWA.
- Email.
- Digest diario/semanal.

Eventos:

- Nueva respuesta en pregunta seguida.
- Experto valido una respuesta.
- Mencion.
- Comentario.
- Edicion aceptada.
- Cambio de reputacion.
- Nueva pregunta en categoria seguida.

## 6. Flujo principal de pregunta

```text
Usuario envia pregunta
  -> Validacion Zod
  -> Auth y rate limit
  -> Crear question en Postgres
  -> Detectar idioma y categoria
  -> Crear evento question.created
  -> Responder rapido con estado "generando"
  -> Worker IA genera respuesta inicial
  -> Guardar ai_answer
  -> Generar embeddings
  -> Crear traducciones prioritarias
  -> Notificar seguidores/categorias relevantes
  -> Exponer pregunta en feed y busqueda
```

## 7. Modelo de permisos

Usar Row Level Security en Supabase desde el inicio.

Roles base:

- anonymous: leer contenido publico permitido.
- user: crear preguntas, responder, votar, guardar, reportar.
- verified_expert: validar respuestas en especialidades aprobadas.
- moderator: revisar reportes y contenido sensible.
- admin: operaciones globales.
- organization_admin: administrar perfil de empresa/universidad.

Reglas:

- El autor puede editar contenido dentro de ventanas controladas.
- Ediciones despues de validacion generan nueva version.
- Expertos solo validan dentro de especialidades verificadas.
- Moderadores no deben acceder a datos privados innecesarios.
- Acciones criticas quedan auditadas.

## 8. Escalabilidad

### Primer millon de usuarios

- Next.js + Supabase + Vercel + Cloudflare.
- Indices Postgres bien disenados.
- Cache en CDN para contenido publico.
- Redis para rate limits y caches calientes.
- Workers asincronos para IA, traducciones y notificaciones.

### Decenas de millones

- Separar servicios de IA, busqueda, notificaciones y reputacion.
- Read replicas para Postgres.
- Particionado de tablas grandes: eventos, votos, notificaciones, vistas.
- Cola robusta: Temporal, Inngest, Trigger.dev, BullMQ o Cloud Tasks equivalente.
- Busqueda dedicada.
- Data warehouse para analitica.

### Cientos de millones

- Multi-region.
- Sharding por entidad o region para dominios de alto volumen.
- Event streaming con Kafka, Redpanda o equivalente.
- Capa de cache distribuida.
- Servicio de ranking de feed independiente.
- Sistema de antifraude dedicado.
- Separacion estricta entre datos transaccionales, busqueda, analitica e IA.

## 9. Seguridad

Requisitos:

- Validacion de entrada con Zod en cliente y servidor.
- RLS en todas las tablas sensibles.
- Rate limiting por endpoint y accion.
- Proteccion CSRF donde aplique.
- CORS restrictivo.
- WAF con Cloudflare.
- Secretos en gestores seguros, nunca en repo.
- Auditoria de acciones administrativas.
- Logs sin datos sensibles.
- Backups y pruebas de restauracion.
- Cumplimiento progresivo: GDPR, CCPA, COPPA si se permite publico menor de edad, HIPAA solo si se entra en salud regulada.

## 10. Observabilidad

Medir desde el dia uno:

- Tiempo hasta primera respuesta de IA.
- Costo por respuesta.
- Latencia por endpoint.
- Errores por ruta y modelo.
- Conversion de pregunta a respuesta util.
- Porcentaje de preguntas con respuesta validada.
- Calidad de busqueda.
- Retencion por cohortes.
- Abuso, reportes y bloqueos.

## 11. Experiencia de usuario

Pantalla inicial:

- Buscador gigante centrado.
- Texto: "What do you want to know?"
- Subtexto: "Ask anything. Learn together."
- Feed publico debajo.
- Filtros: momento, recientes, sin responder, mas votadas, categorias.

Lineamientos:

- Mobile first.
- Modo claro y oscuro.
- Interfaz limpia, rapida y de baja friccion.
- La pregunta debe estar siempre a un toque.
- Las respuestas deben diferenciar claramente IA, comunidad y experto.
- La version canonica debe ser facil de encontrar.
- No convertir el producto en un feed de entretenimiento generico.

## 12. Decisiones clave para MVP

Para avanzar rapido sin bloquear escalabilidad:

- Empezar con una sola app Next.js.
- Usar Supabase Auth, Postgres, Realtime y Storage.
- Modelar eventos desde el inicio aunque se procesen con workers simples.
- Incluir ingles y espanol en UI y datos.
- Incluir embeddings desde el MVP para busqueda semantica.
- Construir admin minimo para moderacion.
- No construir marketplace, videollamadas, VR, agentes personalizados ni API publica en la primera version.

## 13. Riesgos principales

- Costo de IA si no hay cache, limites y modelos por tarea.
- Baja calidad de contenido si no hay reputacion, moderacion y ranking.
- Duplicacion masiva de preguntas sin deteccion semantica.
- Complejidad legal en medicina, derecho y menores.
- Manipulacion de votos y reputacion.
- Traducciones incorrectas en temas tecnicos o sensibles.
- Crecimiento de notificaciones y eventos sin particionado.

## 14. Estrategia recomendada

Construir primero el nucleo:

1. Pregunta.
2. Respuesta IA.
3. Respuesta humana.
4. Voto.
5. Comentario.
6. Perfil.
7. Categoria.
8. Busqueda.
9. Traduccion espanol/ingles.
10. Moderacion basica.

Despues convertir ese nucleo en una plataforma:

1. Validacion de expertos.
2. Reputacion avanzada.
3. Version canonica colaborativa.
4. API.
5. Organizaciones.
6. Marketplace.
7. Agentes.

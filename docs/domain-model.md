# Modelo de dominio y datos

Este documento define el modelo inicial para PostgreSQL/Supabase. Los nombres estan en ingles para facilitar convenciones tecnicas y colaboracion global.

Nota de ecosistema: Zafiro debe vivir como modulo tecnico `knowledge` dentro del Ecosistema MSM. Las entidades globales de usuario, autenticacion, membresia, wallet, billing, notificaciones y auditoria pertenecen al nucleo `core`. Ver [Arquitectura oficial del Ecosistema MSM](msm-ecosystem-architecture.md).

## Entidades principales

### users

Perfil publico y configuracion base.

Campos clave:

- id
- username
- display_name
- avatar_url
- bio
- locale
- country
- reputation_score
- level
- created_at
- updated_at

### user_specialties

Especialidades declaradas o verificadas.

Campos clave:

- id
- user_id
- specialty_id
- status: pending, verified, rejected
- verification_method
- verified_at
- verified_by

### specialties

Areas de conocimiento: medicina, derecho, programacion, ingenieria, educacion, investigacion, arte, etc.

Campos clave:

- id
- slug
- name
- parent_id

### questions

Unidad central del producto.

Campos clave:

- id
- author_id
- type: question, poll, debate, idea, invention, problem, project, research
- status: open, answered, validated, archived, removed
- original_language
- canonical_language
- title
- body
- category_id
- accepted_answer_id
- ai_summary_id
- score
- answer_count
- follower_count
- view_count
- created_at
- updated_at

### question_translations

Traducciones de preguntas.

Campos clave:

- id
- question_id
- language
- title
- body
- provider
- quality_score
- created_at

### question_versions

Historial de edicion.

Campos clave:

- id
- question_id
- editor_id
- title
- body
- change_reason
- created_at

### answers

Respuestas humanas o generadas por IA.

Campos clave:

- id
- question_id
- author_id nullable
- source: ai, human, organization
- status: active, hidden, removed
- original_language
- body
- score
- validation_status: none, disputed, expert_validated, community_validated
- created_at
- updated_at

### answer_versions

Historial de respuestas.

Campos clave:

- id
- answer_id
- editor_id nullable
- body
- change_reason
- created_at

### answer_translations

Traducciones de respuestas.

Campos clave:

- id
- answer_id
- language
- body
- provider
- quality_score
- created_at

### comments

Conversacion alrededor de preguntas y respuestas.

Campos clave:

- id
- parent_type: question, answer
- parent_id
- author_id
- body
- score
- created_at
- updated_at

### votes

Votos ponderados y auditables.

Campos clave:

- id
- user_id
- target_type: question, answer, comment
- target_id
- value: -1, 1
- weight
- created_at

Restriccion unica:

- user_id + target_type + target_id

### categories

Taxonomia visible.

Campos clave:

- id
- slug
- name
- description
- parent_id
- icon

### tags

Etiquetas flexibles.

Campos clave:

- id
- slug
- name

### question_tags

Relacion muchos a muchos.

Campos clave:

- question_id
- tag_id

### follows

Seguimiento de usuarios, preguntas, categorias y expertos.

Campos clave:

- id
- follower_id
- target_type: user, question, category, specialty
- target_id
- created_at

### saved_items

Contenido guardado.

Campos clave:

- id
- user_id
- target_type
- target_id
- collection_id nullable
- created_at

### reputation_events

Fuente de verdad para reputacion.

Campos clave:

- id
- user_id
- event_type
- target_type
- target_id
- points
- metadata
- created_at

### badges

Insignias.

Campos clave:

- id
- slug
- name
- description
- icon

### user_badges

Insignias ganadas.

Campos clave:

- id
- user_id
- badge_id
- awarded_at

### expert_validations

Validaciones de expertos.

Campos clave:

- id
- expert_id
- answer_id
- specialty_id
- verdict: valid, partially_valid, invalid, needs_sources
- note
- created_at

### ai_runs

Registro de ejecuciones de IA.

Campos clave:

- id
- task_type: answer, summarize, translate, classify, moderate, embed, explain, code, image
- provider
- model
- prompt_version
- input_hash
- output_ref
- cost_usd
- latency_ms
- status
- created_at

### embeddings

Vectores para busqueda semantica.

Campos clave:

- id
- target_type
- target_id
- language
- model
- embedding vector
- created_at

### notifications

Notificaciones in-app y push.

Campos clave:

- id
- user_id
- type
- title
- body
- target_type
- target_id
- read_at
- created_at

### reports

Reportes de contenido o usuarios.

Campos clave:

- id
- reporter_id
- target_type
- target_id
- reason
- details
- status: open, reviewing, resolved, rejected
- created_at

### moderation_actions

Acciones tomadas por moderadores o sistemas automaticos.

Campos clave:

- id
- actor_id nullable
- actor_type: ai, moderator, admin
- target_type
- target_id
- action
- reason
- created_at

### audit_log

Auditoria de acciones sensibles.

Campos clave:

- id
- actor_id
- action
- target_type
- target_id
- metadata
- ip_hash
- user_agent_hash
- created_at

## Indices recomendados

- questions(created_at desc)
- questions(score desc)
- questions(category_id, created_at desc)
- questions(status, created_at desc)
- answers(question_id, score desc)
- comments(parent_type, parent_id, created_at)
- votes(target_type, target_id)
- follows(follower_id, target_type)
- notifications(user_id, read_at, created_at desc)
- reputation_events(user_id, created_at desc)
- embeddings usando indice vectorial

## Politicas RLS iniciales

- Contenido publico activo puede ser leido por cualquiera.
- Usuarios autenticados pueden crear preguntas, respuestas, comentarios, votos y reportes.
- Un usuario puede editar su propio contenido si no esta bloqueado, removido o validado bajo reglas estrictas.
- Solo expertos verificados pueden crear expert_validations.
- Solo moderadores/admins pueden actualizar reports y moderation_actions.
- Solo el usuario propietario puede leer sus notificaciones.
- audit_log solo visible para admins autorizados.

# Especificacion funcional del producto

## Concepto

La plataforma es una red social de conocimiento. No compite por fotos, historias, estados o entretenimiento.

La accion principal es:

> Hacer una pregunta.

Todo el producto gira alrededor de preguntas, respuestas, IA, comunidad, expertos y conocimiento guardado.

## Diferencia frente a otras redes sociales

### Facebook / Instagram / TikTok

- Publican vida personal.
- Fotos, videos, historias, entretenimiento.
- Feed infinito.
- Mucho ruido.

### Esta plataforma

- Publica preguntas.
- Respuestas utiles.
- IA inmediata.
- Comunidad que mejora.
- Expertos que validan.
- Conocimiento que no se pierde.

## Regla de producto

No construir funciones solo porque otras redes las tienen.

No incluir al inicio:

- Historias.
- Reels.
- Subida de fotos como contenido principal.
- Estados personales.
- Mensajeria compleja.
- Feed infinito de entretenimiento.

Si se permiten imagenes en el futuro, deben servir al conocimiento:

- Diagramas.
- Capturas de errores.
- Imagenes medicas con reglas estrictas.
- Bocetos de inventos.
- Mapas.
- Documentos.

## Flujo principal

1. Usuario escribe una pregunta.
2. IA detecta idioma, intencion y categoria.
3. IA busca preguntas parecidas.
4. Si no hay duplicado, crea la pregunta.
5. IA responde primero.
6. Comunidad responde y comenta.
7. Expertos validan o corrigen.
8. IA genera resumen canonico.
9. La pregunta queda guardada para otros usuarios.

## Usuarios

El usuario tiene:

- Perfil.
- Preguntas.
- Respuestas.
- Comunidades.
- Guardados.
- Reputacion.
- Insignias.
- Plan.
- Idioma.
- Historial de aprendizaje.

El perfil no debe parecer una red social comun. Debe parecer una identidad de conocimiento.

## Creacion de cuenta

El registro debe ser simple.

Opciones:

- Email.
- Telefono.
- Google.
- GitHub.
- Apple.

Flujo:

1. Usuario crea cuenta.
2. Supabase Auth crea sesion.
3. La base de datos crea perfil publico.
4. Se asigna plan inicial Free.
5. Se guardan idioma, pais y objetivo principal.
6. ELIANA queda disponible como asistente.
7. El usuario puede preguntar, crear comunidad o elegir plan.

Campos iniciales:

- Nombre.
- Email.
- Telefono opcional.
- Objetivo: aprender, crear comunidad, responder como experto o patrocinar.

## Comunidades

Las comunidades son el elemento social principal.

Una comunidad no es un grupo para subir fotos. Es un espacio para resolver preguntas de un tema.

Cada comunidad tiene:

- Nombre.
- Categoria.
- Proposito.
- Preguntas.
- Respuestas.
- IA propia.
- Miembros.
- Expertos.
- Reglas.
- Ranking.
- Resumen semanal.
- Mapa de conocimiento.

## IA de comunidad

Cada comunidad puede tener una IA contextual.

La IA puede:

- Responder preguntas.
- Detectar duplicados dentro de la comunidad.
- Resumir debates.
- Crear guias.
- Recomendar preguntas sin responder.
- Traducir.
- Moderar.
- Crear resumen semanal.

## Elemento novedoso

El producto necesita algo que llame la atencion y no exista igual en redes comunes.

Propuesta:

> Mapa vivo de conocimiento.

En vez de un feed infinito, cada comunidad y cada pregunta genera un mapa:

- Pregunta central.
- Respuestas IA.
- Respuestas humanas.
- Fuentes.
- Expertos.
- Retos.
- Guias.
- Traducciones.
- Resumen final.

Esto hace que la app se sienta distinta.

## Retos de conocimiento

Otra funcion llamativa:

> Knowledge Challenges.

Ejemplos:

- "Resuelve esta pregunta en 5 pasos."
- "Explica este tema como profesor."
- "Encuentra una fuente confiable."
- "Corrige la respuesta de la IA."
- "Convierte esta respuesta en guia."

Los retos generan reputacion y actividad sin depender de fotos o historias.

## IA flotante

La IA flotante vive en la esquina.

Funciones:

- Ayudar a preguntar mejor.
- Sugerir preguntas parecidas.
- Explicar la pagina actual.
- Resumir.
- Traducir.
- Guiar creacion de comunidades.
- Recomendar plan o creditos cuando el usuario llega a limites.

Debe aparecer suavemente, no como anuncio molesto.

## Monetizacion

### Membresia

- Free.
- Plus.
- Pro.

### Creditos de IA

Para tareas costosas:

- Investigacion profunda.
- Documentos.
- Codigo.
- Imagenes.
- Traducciones largas.

### Comunidades premium

Un creador puede cobrar por una comunidad.

La plataforma cobra comision.

### Expertos

Expertos pueden cobrar por:

- Consultas.
- Validaciones.
- Respuestas premium.
- Sesiones privadas.

La plataforma cobra comision.

### Patrocinios

Publicidad limpia por categoria:

- Cursos.
- Herramientas.
- Libros.
- Software.
- Empresas verificadas.

No usar anuncios invasivos.

## Terminos y seguridad

La app debe incluir:

- Terminos de uso.
- Politica de privacidad.
- Reglas de comunidad.
- Politica de pagos.
- Disclaimer de IA.
- Disclaimer medico, legal y financiero.

## MVP funcional para programador

Construir primero:

1. Next.js app.
2. Home con pregunta.
3. Crear pregunta.
4. Respuesta IA real.
5. Pagina de pregunta.
6. Comunidades.
7. Crear comunidad.
8. Perfil.
9. Membresia visual.
10. Supabase Auth.
11. Supabase tables.
12. Stripe Checkout.
13. Terminos y privacidad.

## Esquema inicial de tablas nuevas

### communities

- id
- name
- slug
- category_id
- description
- purpose
- owner_id
- visibility
- monetization_type
- created_at

### community_members

- id
- community_id
- user_id
- role
- reputation_score
- joined_at

### community_questions

- community_id
- question_id

### knowledge_challenges

- id
- community_id
- title
- description
- reward_points
- status
- created_at

### subscriptions

- id
- user_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- current_period_end

### ai_credits

- id
- user_id
- balance
- updated_at

## Frase para explicar el producto

> Una red social donde no subes tu vida: subes tus preguntas, y el mundo las convierte en conocimiento.

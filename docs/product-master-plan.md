# Plan maestro de producto

## Objetivo de esta etapa

Transformar la idea en un prototipo convincente y despues en un MVP funcional.

La prioridad no es construir todas las funciones futuras. La prioridad es demostrar que la experiencia central funciona:

> Hacer una pregunta, recibir una respuesta de IA, mejorarla con personas y preservar conocimiento util.

## Producto minimo viable

El MVP debe incluir:

- Home con buscador protagonista.
- Crear pregunta.
- Respuesta inicial de IA.
- Preguntas similares para evitar duplicados.
- Pagina de pregunta.
- Respuestas humanas.
- Comentarios.
- Votos.
- Perfil publico.
- Categorias.
- Modo claro y oscuro.
- Login con Google y GitHub.
- Moderacion basica.
- Busqueda inicial.

## Pantallas necesarias

### Publicas

- Home.
- Explore.
- Pagina de pregunta.
- Perfil publico.
- Categoria.
- Login.

### Usuario autenticado

- Crear pregunta.
- Responder.
- Guardados.
- Preguntas seguidas.
- Notificaciones.
- Configuracion.

### Admin

- Reportes.
- Usuarios.
- Preguntas bloqueadas.
- Respuestas marcadas por IA.
- Validaciones de expertos.
- Analitica basica.

## Sistemas principales

### IA

Funciones iniciales:

- Respuesta inmediata.
- Deteccion de idioma.
- Deteccion de categoria.
- Preguntas similares.
- Resumen dinamico.
- Traduccion ES/EN.
- Moderacion preventiva.

### Comunidad

Funciones iniciales:

- Responder.
- Comentar.
- Votar.
- Guardar.
- Seguir pregunta.
- Reportar.

### Expertos

No necesita estar completo en MVP publico, pero el modelo debe estar preparado.

Funciones:

- Solicitar verificacion.
- Validar respuesta.
- Marcar respuesta como parcialmente correcta.
- Pedir fuentes.
- Corregir resumen canonico.

### Reputacion

Primera version:

- Puntos por respuestas utiles.
- Puntos por votos positivos.
- Puntos por correcciones aceptadas.
- Penalizaciones por reportes validos.
- Insignias simples.

Version futura:

- Reputacion por especialidad.
- Peso de voto segun confianza.
- Antifraude.
- Ranking por categoria.

## Monetizacion futura

No bloquear el MVP con monetizacion, pero disenar pensando en:

- Premium individual.
- Expertos verificados.
- Empresas verificadas.
- API.
- Marketplace de expertos.
- Cursos.
- Certificaciones.
- Patrocinios por categoria.

## Nombre e identidad

Nombres candidatos:

- Nexa.
- Lumora.
- Questia.
- Knowra.
- Omnira.
- Auralis.
- Mindora.

Criterios:

- Corto.
- Global.
- Facil de pronunciar en espanol e ingles.
- Asociado a conocimiento, preguntas o conexion.
- Disponible como dominio y marca antes de decidir definitivamente.

## Orden recomendado de construccion

1. Elegir nombre provisional fuerte.
2. Cerrar logo app y logo IA.
3. Convertir `index.html` en app Next.js.
4. Crear sistema visual con componentes.
5. Crear Supabase schema inicial.
6. Implementar Auth.
7. Implementar preguntas y respuestas.
8. Conectar OpenAI.
9. Agregar busqueda y duplicados.
10. Agregar reputacion y moderacion.

## Riesgos

- Intentar construir demasiadas funciones antes del nucleo.
- Hacer que parezca un feed social comun.
- Costos altos de IA sin cache ni limites.
- Falta de moderacion en temas sensibles.
- Duplicacion masiva de preguntas.
- No diferenciar claramente IA, comunidad y expertos.

## Norte del producto

Cada decision debe responder:

- Hace mas facil preguntar?
- Hace mas confiable la respuesta?
- Ayuda a preservar conocimiento?
- Se siente como una red social nueva, no una copia?


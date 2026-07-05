# Checklist para convertir el prototipo en app funcional

## Estado actual

El proyecto tiene:

- Documentacion de arquitectura.
- Modelo de dominio.
- Vision visual.
- Plan maestro de producto.
- Prototipo navegable en `index.html`.
- Logo SVG de IA.
- Secciones visuales de Home, Explore, Questions, Communities, AI, Brand, Experts, Reputation, Alerts, Market, Admin, Roadmap, Launch y Profile.

Todavia no tiene backend real, login real, base de datos real ni IA conectada.

## Lo que falta para funcionar

### 1. App real

- Crear proyecto Next.js.
- Usar TypeScript.
- Usar TailwindCSS.
- Separar componentes.
- Crear rutas reales.
- Mantener modo claro y oscuro.

### 2. Base de datos

- Crear proyecto Supabase.
- Activar PostgreSQL.
- Crear migraciones.
- Crear tablas principales.
- Activar Row Level Security.
- Crear politicas de lectura y escritura.

### 3. Autenticacion

- Activar Supabase Auth.
- Login con Google.
- Login con GitHub.
- Login con Apple.
- Login con email.
- Crear perfil automaticamente al registrarse.

### 4. Preguntas

- Crear pregunta.
- Editar pregunta.
- Detectar idioma.
- Detectar categoria.
- Buscar preguntas similares.
- Mostrar preguntas publicas.
- Mostrar pagina de pregunta.

### 5. Respuestas

- Crear respuesta inicial de IA.
- Crear respuestas humanas.
- Votar respuestas.
- Comentar respuestas.
- Ordenar por calidad.
- Crear resumen canonico.

### 6. IA

- Conectar OpenAI.
- Responder preguntas.
- Resumir conversaciones.
- Traducir ES/EN.
- Clasificar categoria.
- Detectar duplicados.
- Moderar contenido.
- Crear embeddings para busqueda semantica.

### 7. Comunidad

- Votar.
- Comentar.
- Guardar.
- Seguir preguntas.
- Seguir categorias.
- Seguir expertos.
- Reportar contenido.

### 8. Reputacion

- Puntos por respuestas utiles.
- Puntos por validaciones.
- Puntos por correcciones aceptadas.
- Insignias.
- Niveles.
- Ranking por categoria.

### 9. Expertos

- Solicitud de verificacion.
- Especialidades.
- Validacion de respuestas.
- Historial de validaciones.
- Insignia de experto.

### 10. Moderacion

- Reportes.
- Cola de revision.
- Filtros de IA.
- Bloqueo de spam.
- Auditoria.
- Rate limiting.

### 11. Notificaciones

- In-app.
- Push PWA.
- Email digest.
- Alertas por pregunta seguida.
- Alertas por validacion de experto.

### 12. Deploy

- GitHub.
- Vercel.
- Variables de entorno.
- Dominio.
- Cloudflare.
- Backups.
- Monitoreo de errores.

## Variables necesarias

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- OAuth Google client id/secret.
- OAuth GitHub client id/secret.
- OAuth Apple client id/secret.

## Primera meta tecnica

Crear una app Next.js que replique el prototipo actual y deje listo:

- Home.
- Question page.
- Explore.
- Profile.
- Brand.
- Launch.
- Theme toggle.
- AI corner assistant.

Despues se conecta Supabase y OpenAI.


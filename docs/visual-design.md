# Vision visual y sistema de interfaz

## 1. Intencion

Zafiro debe sentirse como la red social del conocimiento de los proximos 20 anos. No debe copiar el lenguaje visual de Facebook, X, Reddit, Quora o foros tradicionales. Debe transmitir que el usuario entra a una nueva capa de Internet: mas inteligente, mas limpia, mas global y mas colaborativa.

Referencias de sensacion:

- Apple: claridad, espacio, precision y calma.
- OpenAI: inteligencia accesible, minimalismo y confianza.
- Notion: organizacion del conocimiento sin friccion.
- Arc Browser: navegacion moderna, liviana y con personalidad.
- Tesla: tecnologia premium y futurista.
- Stripe: sofisticacion visual y movimiento sutil.
- Linear: velocidad, foco, contraste y detalle.

La experiencia debe comunicar:

- Inteligencia.
- Elegancia.
- Rapidez.
- Confianza.
- Innovacion.
- Conocimiento.
- Escalabilidad.
- Futuro.

## 2. Concepto central

El protagonista visual es una gran pregunta.

La pantalla inicial no debe sentirse como un feed social tradicional. Debe sentirse como un portal vivo de conocimiento global. El usuario abre la app y ve inmediatamente un buscador central enorme, elegante y activo.

Textos principales:

- "What do you want to know?"
- "Ask anything..."
- "Ask anything. Learn together."

El buscador es el corazon de la plataforma. Todo el sistema visual debe girar alrededor de esta accion.

## 3. Principios visuales

- Mobile first real: la experiencia principal debe ser excelente en telefono.
- Mucho espacio en blanco en modo claro y mucho espacio oscuro respirable en modo oscuro.
- Interfaz silenciosa: pocos elementos, alta claridad.
- Tipografia grande donde la pregunta sea protagonista.
- Navegacion minima, sin botones innecesarios.
- Tarjetas ligeras, no pesadas.
- Efecto glassmorphism moderado, sin perder legibilidad.
- Animaciones suaves, cortas y utiles.
- El usuario siempre debe entender que la IA esta presente, pero no debe dominar a la comunidad.
- Cada pieza visual debe reforzar conocimiento, no entretenimiento vacio.

## 4. Paleta

### Colores base

- White: `#FFFFFF`
- Soft white: `#F7F8FA`
- Ink: `#090A0F`
- Graphite: `#171923`
- Muted text: `#6B7280`
- Border light: `#E5E7EB`
- Border dark: `#272A36`

### Colores de marca

- Electric blue: `#2563FF`
- Future cyan: `#00D4FF`
- Violet: `#7C3AED`
- Magenta accent: `#D946EF`

### Gradientes

Usar gradientes como acento, no como fondo dominante permanente.

```css
linear-gradient(135deg, #2563FF 0%, #7C3AED 48%, #D946EF 100%)
linear-gradient(135deg, #00D4FF 0%, #2563FF 55%, #7C3AED 100%)
```

### Regla de uso

- 70% superficie neutra.
- 20% contraste tipografico.
- 10% acentos electricos.

El producto no debe volverse completamente azul/morado. Los acentos deben guiar la atencion.

## 5. Tipografia

Fuente principal:

- Inter.

Alternativa premium si esta disponible en entorno Apple:

- SF Pro Display para titulos.
- SF Pro Text para UI.

Escala sugerida:

- Hero question: 40-64 px desktop, 30-40 px mobile.
- Page title: 28-40 px.
- Section title: 20-28 px.
- Card question: 17-21 px.
- Body: 15-17 px.
- Metadata: 12-13 px.

Reglas:

- Letter spacing en `0`.
- Peso 500-700 para preguntas.
- Peso 400-500 para respuestas y metadata.
- Line-height amplio en contenido largo.
- Nunca usar texto pequeno para informacion critica.

## 6. Layout global

### Mobile

Estructura:

1. Header compacto.
2. Buscador protagonista.
3. Capsulas de categorias.
4. Muro vivo de conocimiento.
5. Navegacion inferior.

La navegacion inferior incluye:

- Home
- Explore
- Questions
- AI
- Profile

Search puede estar integrado en Home como accion principal.

### Desktop

Estructura:

1. Sidebar izquierda minimalista.
2. Columna central de conocimiento.
3. Panel derecho contextual.

Sidebar:

- Home
- Explore
- Questions
- Communities
- AI
- Profile
- Search

Panel derecho:

- Preguntas trending.
- Expertos activos.
- Categorias relevantes.
- Actividad en tiempo real.

### Ultrawide

No estirar contenido infinitamente.

- Max width de columna central: 760-900 px.
- Sidebar fija.
- Panel derecho: 320-420 px.
- Espacios laterales usados para contexto, no para agrandar tarjetas.

## 7. Home

La home debe abrir con un primer viewport memorable.

Elementos:

- Fondo limpio con acentos suaves.
- Buscador gigante centrado.
- Texto principal dentro o sobre el buscador: "What do you want to know?"
- Subtexto: "Ask anything. Learn together."
- Categorias flotantes debajo.
- Inicio del muro vivo visible al final del primer viewport.

El usuario debe poder preguntar sin navegar.

## 8. Buscador protagonista

Componente central: `QuestionComposer`.

Estados:

- Empty: placeholder grande, elegante.
- Focused: borde con brillo electrico suave.
- Typing: IA detecta intencion.
- Suggestions: preguntas similares existentes.
- Thinking: animacion de IA procesando.
- Answering: respuesta inicial aparece progresivamente.
- Submitted: transicion hacia pagina de pregunta.

Comportamiento:

- Mientras el usuario escribe, mostrar intencion detectada.
- Mostrar preguntas similares para evitar duplicados.
- Sugerir categoria e idioma.
- Permitir enviar con `Enter` en desktop y boton principal en mobile.

Visual:

- Borde redondeado grande.
- Fondo glass.
- Sombra suave.
- Cursor y glow sutil.
- Icono de IA animado.
- Boton de enviar con icono, no texto largo.

## 9. Muro vivo de conocimiento

No es un feed social tradicional. Es una superficie de preguntas publicas del mundo en tiempo real.

Filtros:

- Preguntas del momento.
- Recientes.
- Sin responder.
- Mas votadas.
- Categorias.
- Idioma.

Cada tarjeta muestra:

- Pregunta.
- Respuesta resumida por IA.
- Cantidad de respuestas.
- Cantidad de expertos participando.
- Tiempo.
- Idioma.
- Categoria.
- Popularidad.

Regla visual:

- La pregunta manda.
- La respuesta resumida ayuda.
- La metadata no compite.

## 10. Tarjetas de conocimiento

Componente: `KnowledgeCard`.

Anatomia:

- Categoria en capsula.
- Idioma en mini etiqueta.
- Pregunta.
- Resumen IA maximo 2-4 lineas.
- Indicadores: respuestas, expertos, popularidad, tiempo.
- Estado de validacion si existe.

Estilo:

- Radio: 16-24 px en tarjetas principales.
- Borde: 1 px translucido.
- Fondo claro: `rgba(255,255,255,0.72)`.
- Fondo oscuro: `rgba(18,20,30,0.68)`.
- Blur: 16-24 px.
- Sombra: suave, difusa, sin parecer tarjeta pesada.
- Hover desktop: elevacion pequena, borde mas luminoso, traduccion vertical de 2-4 px.
- Tap mobile: respuesta tactil rapida.

## 11. Glassmorphism

Debe usarse con control.

Permitido:

- Buscador principal.
- Tarjetas de conocimiento.
- Panel contextual.
- Menus flotantes.
- Composer de respuesta.

Evitar:

- Fondos demasiado borrosos.
- Bajo contraste.
- Demasiadas capas transparentes.
- Glass en textos largos si reduce legibilidad.

## 12. ELIANA como companera visual

La IA de la plataforma se llama ELIANA Asistente Virtual. Debe sentirse presente como una inteligencia colaborativa, no como un chatbot separado.

Representaciones:

- Pequeno indicador animado en buscador.
- Etiqueta "AI summary".
- Panel flotante "ELIANA Asistente Virtual".
- Estado "Understanding intent".
- Estado "Finding related questions".
- Estado "Drafting first answer".
- Resumen dinamico en conversaciones largas.

Animacion de pensamiento:

- Puntos o particulas suaves.
- Linea de energia discreta.
- Texto apareciendo progresivamente.
- Duracion corta y fluida.

No usar animaciones infantiles ni excesivas.

## 13. Pagina de pregunta

Estructura:

- Pregunta grande arriba.
- Metadata clara: idioma, categoria, tiempo, autor, popularidad.
- Respuesta inicial de IA en bloque distinguible.
- Resumen dinamico de la conversacion.
- Respuestas humanas ordenadas por calidad.
- Validaciones de expertos visibles.
- Comentarios secundarios.
- Composer de respuesta fijo o facil de acceder.

Jerarquia:

1. Pregunta.
2. Mejor respuesta o resumen canonico.
3. Validacion experta.
4. Aportes de comunidad.
5. Discusion secundaria.

## 14. Categorias

Las categorias aparecen como capsulas flotantes, especialmente en Home y Explore.

Categorias iniciales:

- Tecnologia
- Ciencia
- Negocios
- Salud
- Historia
- Biblia
- Programacion
- Inventos
- Espacio
- Finanzas
- Viajes
- Educacion
- IA
- Arte
- Musica

Colores sugeridos:

- Tecnologia: `#2563FF`
- Ciencia: `#00A8E8`
- Negocios: `#10B981`
- Salud: `#14B8A6`
- Historia: `#A16207`
- Biblia: `#8B5CF6`
- Programacion: `#0F172A`
- Inventos: `#F59E0B`
- Espacio: `#6366F1`
- Finanzas: `#22C55E`
- Viajes: `#06B6D4`
- Educacion: `#3B82F6`
- IA: `#7C3AED`
- Arte: `#EC4899`
- Musica: `#F43F5E`

En modo oscuro, usar fondos transparentes con borde del color de categoria.

## 15. Navegacion

Debe ser minima.

Items:

- Home
- Explore
- Questions
- Communities
- AI
- Profile
- Search

Reglas:

- Usar icono + etiqueta solo cuando haya espacio.
- En mobile, usar 5 items maximos en barra inferior.
- Search vive como accion principal en Home.
- Evitar menus duplicados.
- Evitar botones secundarios sin proposito claro.

## 16. Modo claro

Sensacion:

- Premium.
- Aireado.
- Preciso.
- Optimista.

Superficies:

- Fondo: blanco o soft white.
- Tarjetas: blanco translucido.
- Texto: negro/graphite.
- Acentos: azul electrico y violeta.

## 17. Modo oscuro

Sensacion:

- Futurista.
- Profundo.
- Tecnologico.
- Elegante.

Superficies:

- Fondo: `#090A0F`.
- Tarjetas: `rgba(18,20,30,0.72)`.
- Bordes: `rgba(255,255,255,0.10)`.
- Texto: `#F9FAFB`.
- Metadata: `#9CA3AF`.
- Acentos: cyan, azul y violeta.

## 18. Animaciones

Objetivo: 60 FPS.

Usar:

- `transform`
- `opacity`
- `filter` con cuidado

Evitar:

- Animar layout.
- Animar sombras grandes continuamente.
- Fondos pesados en mobile.

Duraciones:

- Microinteraccion: 120-180 ms.
- Transicion de pantalla: 220-320 ms.
- IA pensando: loop suave 900-1400 ms.
- Aparicion de respuesta: 250-500 ms.

Animaciones clave:

- Focus del buscador.
- Entrada de sugerencias.
- Aparicion de tarjetas en muro vivo.
- Actualizacion en tiempo real.
- Voto y guardado.
- Cambio claro/oscuro.
- IA generando respuesta.

## 19. Iconografia

Usar SVG consistente.

Recomendacion:

- Lucide React para iconos de interfaz.
- Iconos propios SVG solo para marca, IA y categorias si hace falta.

Reglas:

- Stroke uniforme.
- No mezclar estilos filled y outline sin razon.
- Iconos pequenos, precisos y alineados.
- Botones de icono con tooltip en desktop.

## 20. Componentes principales

Componentes base:

- `AppShell`
- `SidebarNav`
- `BottomNav`
- `TopBar`
- `QuestionComposer`
- `IntentDetector`
- `SimilarQuestionList`
- `KnowledgeWall`
- `KnowledgeCard`
- `CategoryPill`
- `AISummaryBlock`
- `AnswerCard`
- `ExpertValidationBadge`
- `ReputationBadge`
- `LanguageBadge`
- `LiveActivityIndicator`
- `ThemeToggle`
- `NotificationBell`
- `ProfilePreview`

## 21. Estados vacios y carga

Los estados vacios deben mantener el tono premium.

Ejemplos:

- No hay preguntas en una categoria: mostrar composer y categorias relacionadas.
- No hay respuestas humanas: destacar que la comunidad puede mejorar la respuesta IA.
- IA pensando: skeleton elegante con indicador de inteligencia.
- Error de IA: permitir reintentar, no romper la experiencia.

## 22. Accesibilidad

Requisitos:

- Contraste WCAG AA minimo.
- Navegacion por teclado.
- Focus visible.
- Preferencia `prefers-reduced-motion`.
- Textos legibles en mobile.
- Iconos con `aria-label` cuando sean accion.
- No depender solo del color para estados.

## 23. Performance visual

Requisitos:

- Cargar rapido en mobile.
- Evitar bundles pesados de animacion si no son necesarios.
- Lazy load de paneles secundarios.
- Virtualizar listas largas.
- Usar imagenes optimizadas.
- Evitar blur excesivo en dispositivos de bajo rendimiento.
- Mantener interacciones principales bajo 100 ms percibidos.

## 24. Primera version visual del MVP

Pantallas necesarias:

1. Home con buscador gigante y muro vivo.
2. Pagina de pregunta.
3. Explore por categorias.
4. Perfil publico.
5. Login.
6. Panel basico de IA.
7. Admin/moderacion minimo.

Prioridad visual:

1. Buscador protagonista.
2. Tarjetas de conocimiento.
3. Respuesta IA.
4. Modo claro/oscuro.
5. Categorias flotantes.
6. Animaciones de intencion y pensamiento.

## 25. Frase guia

Cada decision visual debe pasar esta prueba:

> Al abrir la aplicacion, una persona debe pensar: "Esta es la red social del futuro."

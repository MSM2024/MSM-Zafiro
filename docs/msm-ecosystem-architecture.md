# Arquitectura oficial del Ecosistema MSM

## 1. Vision

MSM debe crecer como un ecosistema de productos conectados, no como aplicaciones aisladas. La regla principal es simple:

Una sola cuenta. Un solo usuario. Una sola identidad. Multiples productos.

El usuario entra una vez y puede usar Album de la Vida, MSM Mente Maestra, Zafiro y MSM Marketplace sin crear cuentas separadas.

## 2. Proyectos oficiales

### Album de la Vida

Preserva historia personal y familiar con IA, fotos, videos, arbol genealogico, libros automaticos y legado digital.

### MSM Mente Maestra

Plataforma de crecimiento personal, espiritual, empresarial y tecnologico con metas, habitos, oracion, comunidad, mentorias e IA.

### Zafiro

Red social basada en preguntas. La IA responde primero, la comunidad mejora y los expertos validan. Su objetivo es construir una biblioteca viva de conocimiento mundial.

### MSM Marketplace

Marketplace global con tiendas, productos, servicios, pagos, wallet, paneles administrativos, remesas, cambio de moneda y futura integracion con Cajeros MSM.

## 3. Principio tecnico

El ecosistema se divide en dos capas:

- MSM Core Platform: identidad, pagos, wallet, permisos, IA, notificaciones, auditoria, analitica y administracion.
- MSM Product Modules: Album, Mente Maestra, Zafiro y Marketplace.

Cada producto puede evolucionar por separado, pero todos usan el mismo nucleo.

## 4. MSM Core Platform

### MSM Account

Sistema unico de autenticacion.

Capacidades:

- Email y password.
- Telefono.
- Google Login.
- Apple Login.
- Microsoft Login.
- GitHub Login.
- Sesiones seguras.
- Recuperacion de cuenta.
- Verificacion de identidad cuando sea necesario.

### MSM ID

Identificador unico global del usuario dentro de todo el ecosistema.

Ejemplo:

```text
msm_user_id = 9d8f... global para todas las apps
```

Ese ID conecta:

- Perfil publico.
- Perfil privado.
- Plan de membresia.
- Wallet.
- Historial de pagos.
- Permisos.
- Actividad por producto.
- Preferencias de idioma.
- Configuracion de IA.

### MSM Profile

Perfil comun del usuario.

Datos compartidos:

- Nombre.
- Foto.
- Bio.
- Pais.
- Idioma preferido.
- Telefono.
- Email.
- Nivel general.
- Reputacion global.
- Apps activas.

Datos por producto:

- Reputacion en Zafiro.
- Habitos en Mente Maestra.
- Albumes familiares en Album de la Vida.
- Tiendas, compras o ventas en Marketplace.

## 5. Modulos compartidos

### Auth Service

Maneja login, sesiones, OAuth, permisos y seguridad.

### Billing Service

Maneja Stripe, suscripciones, creditos, facturas, cancelaciones, upgrades, downgrades y webhooks.

### Wallet Service

Prepara el ecosistema para saldo interno, pagos, reembolsos, comisiones, remesas y futura integracion con Cajeros MSM.

### AI Core

Capa comun de inteligencia artificial para todo MSM.

ELIANA puede ser el asistente visible para Zafiro y tambien la base de IA del ecosistema.

Capacidades:

- Responder.
- Resumir.
- Traducir.
- Clasificar.
- Moderar.
- Crear planes.
- Analizar sponsors.
- Recomendar expertos.
- Generar documentos.
- Detectar duplicados.
- Crear mapas de conocimiento.

### Notification Service

Notificaciones compartidas:

- In-app.
- Push.
- Email.
- SMS opcional.
- Alertas de pago.
- Alertas de comunidad.
- Recordatorios.

### Admin OS

Panel interno para operar todo el ecosistema.

Capacidades:

- Usuarios.
- Pagos.
- Sponsors.
- Reportes.
- Moderacion.
- Contenido.
- Tiendas.
- Comunidades.
- IA y costos.
- Analitica.

## 6. Separacion de datos

No se debe mezclar todo en una sola tabla gigante. Se recomienda usar schemas separados en PostgreSQL:

```text
core.users
core.profiles
core.auth_identities
core.organizations
core.memberships
core.wallets
core.billing_customers
core.notifications
core.audit_log

knowledge.questions
knowledge.answers
knowledge.comments
knowledge.votes
knowledge.expert_validations
knowledge.communities

album.memories
album.media
album.family_members
album.family_trees
album.legacy_books

mindmaster.goals
mindmaster.habits
mindmaster.prayers
mindmaster.mentorships
mindmaster.progress_logs

marketplace.stores
marketplace.products
marketplace.orders
marketplace.payments
marketplace.remittances
marketplace.cashier_events
```

Asi todos comparten usuario, pero cada producto mantiene su dominio limpio.

## 7. Flujo de usuario

```text
Usuario crea MSM Account
  -> Se crea core.users
  -> Se crea core.profiles
  -> Se crea core.memberships con plan inicial
  -> Se crea core.wallets
  -> Se guardan preferencias de idioma
  -> El usuario entra al App Hub MSM
  -> Puede abrir Zafiro, Album, Mente Maestra o Marketplace
```

## 8. Flujo de pago

```text
Usuario elige plan o compra
  -> Stripe Checkout
  -> Stripe confirma pago
  -> Webhook actualiza core.memberships o marketplace.orders
  -> Billing Service registra factura
  -> Wallet Service registra movimiento si aplica
  -> Notification Service avisa al usuario
```

## 9. Monetizacion del ecosistema

Fuentes principales:

- Membresias personales.
- Creditos de IA.
- Sponsors y publicidad limpia.
- Comunidades premium.
- Comisiones del marketplace.
- Tiendas verificadas.
- Expertos verificados.
- Cursos y certificaciones.
- API para empresas.
- Wallet y servicios financieros futuros.
- Cajeros MSM futuros.

## 10. Seguridad

Requisitos desde el primer dia:

- Row Level Security en Supabase.
- Separacion por rol.
- Auditoria de acciones criticas.
- Rate limits.
- Validacion con Zod.
- Moderacion automatica por IA.
- Proteccion contra spam y fraude.
- Logs sin datos sensibles.
- Webhooks Stripe verificados.
- Backups y restauracion probada.

## 11. Monorepo recomendado

```text
apps/
  hub/                  Entrada principal del ecosistema MSM
  knowledge/            Red Social del Conocimiento
  album/                Album de la Vida
  mindmaster/           MSM Mente Maestra
  marketplace/          MSM Marketplace
  admin/                Admin OS

packages/
  ui/                   Componentes compartidos
  auth/                 Login, permisos y sesiones
  db/                   Tipos, migraciones y queries
  billing/              Stripe y membresias
  wallet/               Wallet y movimientos
  ai/                   ELIANA / AI Core
  notifications/        Push, email e in-app
  validation/           Schemas Zod
  observability/        Logs, metricas y trazas

supabase/
  migrations/
  seed.sql
  policies/
```

## 12. Orden recomendado para construir

1. MSM Account y Supabase Auth.
2. Core users, profiles, memberships y wallet basica.
3. Zafiro MVP: preguntar, IA responde, comunidad comenta.
4. Stripe para membresias y sponsors.
5. Admin OS minimo.
6. Mente Maestra MVP.
7. Album de la Vida MVP.
8. Marketplace MVP.
9. Integracion avanzada de wallet, remesas y Cajeros MSM.

## 13. Decision clave

Zafiro debe ser el primer producto publico fuerte porque puede atraer usuarios por curiosidad, preguntas, IA y conocimiento. Luego ese usuario ya queda dentro de MSM y puede descubrir los otros productos del ecosistema.

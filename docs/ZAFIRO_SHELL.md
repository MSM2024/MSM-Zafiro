# ZAFIRO Shell — Experiencia de Sistema Operativo

## Elementos

- Pantalla de inicio
- Bloqueo
- Launcher
- Dock
- Ventanas
- Widgets
- Buscador
- Panel rápido
- Centro de notificaciones
- Perfil
- Configuración
- Archivos
- Ayuda
- ELIANA flotante

## Rutas Propuestas

| Ruta | Componente |
|------|-----------|
| `/os` | ZafiroShell |
| `/os/home` | ZafiroDesktop |
| `/os/apps` | ZafiroAppLauncher |
| `/os/search` | ZafiroSearch |
| `/os/files` | ZafiroFiles |
| `/os/notifications` | ZafiroNotificationCenter |
| `/os/settings` | ZafiroSettings |
| `/os/security` | ZafiroSecurity |
| `/os/devices` | ZafiroDevices |
| `/os/account` | ZafiroAccount |
| `/os/help` | ZafiroHelp |
| `/os/eliana` | ZafiroEliana |

## Componentes Principales

- `ZafiroShell` — Contenedor principal con layout de SO
- `ZafiroTopBar` — Barra superior con estado, hora, notificaciones, perfil
- `ZafiroDock` — Dock inferior con apps favoritas y launcher
- `ZafiroWindowManager` — Gestor de ventanas con arrastre, resize, minimizar
- `ZafiroAppLauncher` — Grid de aplicaciones instaladas y disponibles
- `ZafiroSearch` — Búsqueda universal
- `ZafiroNotificationCenter` — Centro de notificaciones desplegable
- `ZafiroControlCenter` — Panel rápido (WiFi, Bluetooth, brillo, volumen)
- `ZafiroLockScreen` — Pantalla de bloqueo con identidad ZAFIRO
- `ZafiroBootScreen` — Pantalla de inicio con animación ZAFIRO

## Estados de Ventana

- `OPEN` — Abierta y visible
- `MINIMIZED` — Minimizada al dock
- `MAXIMIZED` — Pantalla completa
- `CLOSED` — Cerrada
- `FOCUSED` — En foco activo

# ZAFIRO OS — Desktop Plan

## Tecnología

- **Runtime**: Tauri 2 (Rust + WebView)
- **Instalador**: Windows MSI/EXE
- **Actualización**: Tauri updater
- **Icono**: Diamante ZAFIRO aprobado
- **Almacenamiento**: Local cifrado (AES-256)
- **Notificaciones**: Sistema operativo nativas
- **Enlaces profundos**: zafiro:// protocol

## Fases de Desktop

### Fase 1: Empaquetado Web
- Tomar la PWA existente
- Empaquetar con Tauri 2
- Probar navegación básica
- Probar almacenamiento local

### Fase 2: Experiencia Nativa
- Barra de título personalizada
- Menú de aplicación
- Notificaciones nativas
- Arrastrar y soltar archivos
- Integración con explorador de archivos

### Fase 3: Automatización
- Actualización automática
- Backup local
- Sincronización offline
- Modo quiosco (opcional)

## Iconos Requeridos

- PNG 1024, 512, 256, 192, 180, 96, 64, 48, 32, 16
- ICO Windows (multi-resolución)
- ICNS macOS

## Requisitos para Release

- Build reproducible
- Instalador probado en Windows limpio
- Desinstalación completa
- Actualización desde versión anterior
- Rollback functionality
# ZAFIRO OS — AOSP Roadmap

## Estado Actual

🔴 **Investigación** — No hay código fuente AOSP, build, imagen de sistema ni dispositivo de prueba.

## Requisitos para Declarar Progreso

1. Código fuente AOSP clonado y configurado
2. Build reproducible del sistema base
3. Imagen del sistema para dispositivo de prueba
4. Boot verificado funcionando
5. Launcher personalizado ZAFIRO funcionando
6. Apps MSM preinstaladas
7. Identidad ZAFIRO integrada
8. Tienda de aplicaciones autorizadas
9. Configuración de seguridad
10. Actualización OTA funcional

## Stack Propuesto

- **Base**: Android Open Source Project (última versión estable)
- **Launcher**: Launcher3 personalizado con tema ZAFIRO
- **Apps**: WebView apuntando a ZAFIRO Web OS + wrappers nativos
- **Identidad**: Account Manager + ZAFIRO Identity Provider
- **Seguridad**: Verified Boot, SELinux, encryption
- **Actualizaciones**: OTA con A/B partitioning

## Prohibiciones

- No declarar ZAFIRO AOSP terminado sin build reproducible
- No declarar soporte sin dispositivo de prueba
- No prometer funcionalidad sin código fuente verificado
- No mezclar AOSP con Web OS en la documentación
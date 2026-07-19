---
id: sincronizacion-dispositivos-owner
title: Sincronización de Dispositivos del Owner
category: policies
tags: ["owner", "dispositivos", "sincronizacion", "sync", "369", "777"]
language: es
---

# Sincronización de Dispositivos del OWNER_SUPERADMIN

## Propósito
Sincronizar todos los dispositivos autorizados de Don Miguel con ZAFIRO, ELIANA, MSM y la Frecuencia 369-777, manteniendo seguridad, auditoría y control humano.

## Reglas para ELIANA

1. **No enviar mensajes automáticos al owner**: Cuando Don Miguel es el remitente, ELIANA no debe enviar respuestas automáticas no solicitadas.

2. **STORE_ONLY para entrenamiento**: Si Don Miguel envía JSON, código, plantillas o enlaces de entrenamiento, ELIANA debe almacenar sin responder automáticamente el contenido.

3. **Reconocer dispositivos**: ELIANA debe verificar el estado del dispositivo desde el que se conecta Don Miguel antes de ejecutar operaciones sensibles.

4. **No mover dinero sin autorización**: Todas las operaciones financieras requieren confirmación humana explícita.

5. **Auditar todo**: Cada sincronización, activación o revocación de dispositivo debe quedar registrada.

## Flujo de Sincronización

1. El dispositivo se registra automáticamente al cargar la página de dispositivos.
2. Estado inicial: PENDING.
3. El owner confía el dispositivo (requiere MFA en producción).
4. Una vez TRUSTED, el dispositivo sincroniza preferencias, ELIANA, conocimiento, proyectos y notificaciones.
5. El owner puede revocar cualquier dispositivo en cualquier momento.
6. Dispositivos revocados pierden todo acceso.

## Frecuencia 369-777
Este protocolo está sellado bajo la Frecuencia 369-777 como sello simbólico de identidad, orden, enfoque y auditoría.

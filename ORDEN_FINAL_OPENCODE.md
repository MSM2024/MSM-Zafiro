# OPENCODE — ORDEN FINAL: DEJAR ZAFIRO COMPLETAMENTE FUNCIONAL

**Autor:** Miguel Soria Martínez — Fundador ZAFIRO / MSM MY STORE LLC
**Fecha:** 2026-07-16
**Dominio:** https://zafiro.msmmystore.com

---

## OBJETIVO FINAL

ZAFIRO debe dejar de ser solamente una interfaz visual.

Cada botón, formulario, perfil, permiso, imagen, venta, pedido, suscripción y módulo debe:

1. Ejecutar una acción real.
2. Guardar los datos correctamente.
3. Leer los datos guardados.
4. Actualizar los registros.
5. Respetar roles y permisos.
6. Mostrar confirmación clara.
7. Controlar fallos.
8. Registrar auditoría.
9. Tener pruebas.
10. Funcionar en producción.

---

## 1. TERMINAR LO QUE YA EXISTE

Antes de crear módulos nuevos:

- Revisar todas las rutas.
- Probar todos los botones.
- Conectar las pantallas simuladas.
- Corregir enlaces vacíos.
- Corregir imágenes ausentes.
- Eliminar referencias a localhost.
- Corregir errores de consola.
- Unificar componentes repetidos.
- Unificar perfiles duplicados.
- Unificar clientes de Supabase.
- Mantener una sola fuente de verdad.

Clasificar cada función como: FUNCIONAL | PARCIAL | SIMULADA | DESCONECTADA | REPETIDA | PENDIENTE DE PRUEBA

Trabajar primero sobre todo lo PARCIAL, SIMULADO o DESCONECTADO.

---

## 2. DOMINIO Y SEGURIDAD

Dejar validado:

- DNS correcto.
- HTTPS activo.
- Certificado SSL válido.
- Redirección HTTP a HTTPS.
- Sin aviso "Not Secure".
- Sin contenido mixto.
- Proyecto Vercel correcto.
- Rama y commit de producción identificados.
- Variables privadas protegidas.

No modificar el dominio principal ni los registros de correo.

---

## 3. AUTENTICACIÓN Y PERFILES

Hacer funcional:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de acceso.
- Sesión persistente.
- Verificación de correo.
- MFA administrativa.
- Perfil público.
- Perfil privado.
- Fotografía.
- Edición de datos.
- Configuración de seguridad.

Crear y validar roles: OWNER_SUPERADMIN, ADMIN, COMPLIANCE_REVIEWER, SUPPORT_AGENT, ENTREPRENEUR, USER.

Separar: Rol | Membresía | KYC | KYB | Nivel de riesgo.

---

## 4. VIP, KYC Y EMPRENDEDORES

Hacer funcional en modo sandbox:

- Usuario Standard | VIP | VIP con identidad verificada | Emprendedor VIP
- KYC personal | KYB empresarial
- Consentimiento | Carga privada de documentos | Revisión administrativa
- Solicitud de información | Aprobación | Rechazo | Expiración | Auditoría

Las insignias aparecen únicamente cuando el estado real esté confirmado.

---

## 5. MSM ECONOMÍA

Hacer completamente funcional:

- Caja CUP | Caja USD | Inventario | Ventas | Gastos
- Entregas | Transporte | Domicilio | Reservaciones | Clientes
- Comprobantes | Cancelaciones reversibles | Cierre diario | Reportes | Auditoría

Toda operación debe persistir en la base de datos.
Las cancelaciones deben crear movimientos inversos; conservar el historial.

---

## 6. MARKETPLACE

Conectar:

- Catálogo | Categorías | Fotografías | Precios | Inventario real
- Productos disponibles | Productos reservados | Carrito | Pedidos
- Estados | Entregas | Clientes | Comprobantes | MSM Economía

Una venta confirmada debe actualizar el inventario y el Marketplace.

---

## 7. ELIANA

Hacer funcional:

- Chat | Detección de intención | Contexto
- Consulta de: perfil, inventario, caja, ventas, pedidos
- Permisos | Confirmación de acciones sensibles | Escalamiento humano | Auditoría

ELIANA prepara las acciones sensibles y espera confirmación explícita.

---

## 8. WHATSAPP BUSINESS

Conectar mediante la API oficial:

- Webhook | Verificación de firma | Mensajes entrantes | Respuestas
- Bienvenida inicial | Contactos +53 | Conversación persistente
- Plantillas | Escalamiento | Consentimiento | Idempotencia

No almacenar tokens en el frontend.

---

## 9. SUSCRIPCIONES

Hacer funcional inicialmente en sandbox:

- Standard | VIP | Emprendedor VIP
- Renovación | Upgrade | Downgrade | Cancelación | Reactivación
- Período de gracia | Webhooks | Recibos | Auditoría

No activar cobros reales hasta aprobación expresa de Don Miguel.

---

## 10. OFFLINE Y SINCRONIZACIÓN

Hacer funcional:

- PWA | IndexedDB | Modo Éter | Cola local | Operaciones pendientes
- Reconexión | Reintentos | Idempotencia | Conflictos de inventario
- Última unidad | Estados visibles

Estados: GUARDADO | PENDIENTE | SINCRONIZANDO | SINCRONIZADO | REQUIERE_REVISIÓN

---

## 11. IMÁGENES Y NUEVO DISEÑO

Cuando Don Miguel entregue las imágenes originales:

- Guardar en estructura oficial | Optimizar formatos | Crear manifiesto
- Corregir rutas | Añadir texto alternativo | Mantener respaldo diseño anterior
- Probar escritorio y móvil
- Evitar fotografías de pantallas como assets finales
- Comprobar que cada imagen cargue desde producción

---

## 12. SEGURIDAD Y DATOS

Implementar y validar:

- Supabase Auth | RLS | RBAC | MFA
- Validación de formularios | Rate limiting | CSP | CORS
- Protección de webhooks | Auditoría append-only
- URLs firmadas | Almacenamiento privado
- Logs sin datos sensibles | Copias de seguridad | Restauración probada

---

## 13. PRUEBAS COMPLETAS

Ejecutar: lint | type-check | unit tests | integration tests | e2e tests | build

Probar en: Windows | Android | iPhone | Escritorio | Móvil | Con conexión | Sin conexión | Reconexión

Probar como: OWNER | ADMIN | CASHIER | VIEWER | USER | VIP | ENTREPRENEUR

---

## 14. DESPLIEGUE

1. Construir localmente.
2. Desplegar en Preview.
3. Ejecutar pruebas.
4. Entregar enlace Preview.
5. Corregir hallazgos.
6. Solicitar aprobación de Don Miguel.
7. Promover a producción.
8. Verificar en https://zafiro.msmmystore.com

No promover cambios amplios directamente a producción.

---

## 15. CRITERIO DE FINALIZACIÓN

Una función queda terminada cuando:

- La interfaz carga.
- La acción responde.
- Los datos persisten.
- Los permisos funcionan.
- Los estados se actualizan.
- Los fallos se muestran de forma clara.
- La auditoría registra la acción.
- La prueba pasa.
- El build pasa.
- Funciona en Preview.
- Funciona en producción.
- Existe evidencia.

---

## 16. INFORME FINAL

Crear:

- FULL_FUNCTIONAL_AUDIT.md
- FUNCTIONAL_FEATURE_MATRIX.md
- PRODUCTION_READINESS_REPORT.md
- SECURITY_VALIDATION_REPORT.md
- DATABASE_VALIDATION_REPORT.md
- ROLE_PERMISSION_MATRIX.md
- END_TO_END_TEST_RESULTS.md
- DEPLOYMENT_REPORT.md
- BACKUP_RESTORE_REPORT.md
- FINAL_PENDING_ITEMS.md

Entregar tabla: Módulo | Función | Estado inicial | Trabajo realizado | Prueba | Estado final | Evidencia

Reporte final con: DOMINIO, HTTPS, COMMIT, BUILD, RUTAS, FUNCIONES PROBADAS, FUNCIONES COMPLETADAS, FUNCIONES EN SANDBOX, BASE DE DATOS, AUTENTICACIÓN, PERFILES, MSM ECONOMÍA, MARKETPLACE, ELIANA, WHATSAPP, OFFLINE, SEGURIDAD, BACKUP, PRUEBAS, PENDIENTES, SIGUIENTE VERSIÓN.

---

> OpenCode, completa la ingeniería de ZAFIRO de extremo a extremo. Cada pantalla debe quedar conectada a funciones reales, datos persistentes, permisos, auditoría y pruebas antes de declarar el sistema terminado. 💎🛠️🚀

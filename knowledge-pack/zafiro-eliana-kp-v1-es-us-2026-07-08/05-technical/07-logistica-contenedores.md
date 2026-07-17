---
id: "tech-07-logistica-contenedores"
title: "Logística de Contenedores — Frecuencia 369"
category: "05-technical"
doc_form: "text_model"
tags: ["logistica", "contenedores", "frecuencia-369", "granero-msm", "cuba"]
language: "es"
---

# Logística de Contenedores — Frecuencia 369

## Descripción General

El módulo de Logística de Contenedores gestiona el envío de carga desde USA y Panamá hacia Cuba. Está sellado con la Frecuencia 369 para asegurar que cada embarque llegue con rapidez y orden.

## Rutas

- **Origen**: USA / Panamá
- **Destino**: Cuba
- **Flujo**: Contenedores marítimos con cargas prioritarias

## Cargas Prioritarias

| Categoría | Ejemplos | Valor Estimado por Unidad |
|-----------|----------|--------------------------|
| Ventiladores Recargables | Ventiladores portátiles, baterías |  USD |
| Combos de Comida | Paquetes alimenticios, provisiones |  USD |
| Equipos EKO | Equipos ecológicos y tecnológicos |  USD |
| Otros | Varios |  USD |

## Estados del Contenedor

1. **Planificado** — Contenedor registrado, pendiente de salida
2. **En tránsito** — En ruta hacia Cuba
3. **En aduana** — Procesando ingreso en aduana cubana
4. **En almacén** — Arribado y almacenado en el Granero MSM
5. **Distribuyendo** — En distribución a la familia
6. **Completado** — Ciclo cerrado

## Sincronización con Ledger Maestro

Cuando un contenedor alcanza el estado **Completado**, su valor estimado en USD se inyecta automáticamente al Ledger Maestro como entrada de capital al nodo FONDO_MSM, con referencia al código de sello 369 del contenedor.

## Granero MSM

El Granero es el inventario consolidado de todos los contenedores activos. Muestra:
- Total de contenedores
- Items en tránsito y completados
- Valor total estimado en USD
- Desglose por categoría prioritaria

## Frecuencia 369

Cada contenedor recibe un sello único con formato CTN-XXXX-369 que lo ancla al Protocolo de Abundancia. La frecuencia 369 se manifiesta en:
- La creación de cada contenedor
- El manifiesto de carga
- La sincronización con el Ledger
- El reporte de cierre

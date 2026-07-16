# Extracción de Activos Técnicos — MSM Marketplace

**Origen:** Repositorio independiente de MSM Marketplace
**Destino:** Integración en monorepo ZAFIRO (vía APIs y Eventos)
**Fecha:** 2026-07-16

---

## Stack del Marketplace

Next.js 15.5 + TypeScript 5.7 + Supabase (PostgreSQL) + Prisma 6.18 + Tailwind CSS 3.4 + Zod 4.1 + Resend 6.4 + Lucide React + Vitest 4.1 + pnpm

## Archivos Clave

| Ruta | Descripción |
|------|-------------|
| `src/server/actions/orders.ts` | CreateCheckoutOrder, createBatchCheckoutOrders, updateVipOrderStatus (1026 líneas) |
| `src/components/marketplace/checkout-form.tsx` | Formulario de checkout completo |
| `src/app/checkout/page.tsx` | Página checkout con sidebar de resumen |
| `src/lib/validations.ts` | Esquemas Zod para checkout, órdenes, devoluciones, reseñas |
| `src/lib/notifications.ts` | notifyOrderCreated, notifyOrderStatusChange, etc. |
| `src/server/actions/coupons.ts` | validateCoupon |
| `src/server/actions/tax-shipping.ts` | getTaxForLocation, getShippingCost |
| `src/server/actions/wishlist.ts` | Wishlist/favoritos |
| `src/server/actions/reviews.ts` | Reseñas de productos |
| `src/server/actions/returns.ts` | Solicitudes de devolución |
| `src/server/actions/products.ts` | Gestión de productos |
| `src/server/actions/sellers.ts` | Gestión de vendedores VIP |
| `src/server/actions/admin.ts` | adminCreateUser, createManualVipStore |
| `src/lib/cart-store.ts` | Carrito persistente en sessionStorage |
| `src/lib/risk/customer-risk.ts` | calculateCustomerRisk |

## Esquemas Supabase (15 tablas)

- `stores` — Tiendas por vendedor
- `products` — Productos con imágenes y stock
- `orders` — Órdenes completas con todos los campos
- `order_items` — Items de cada orden
- `profiles` — Perfiles de cliente/vendedor
- `coupons` — Cupones de descuento
- `tax_rates` — Tasas de impuestos por región
- `shipping_rates` — Costos de envío
- `reviews` — Reseñas de productos
- `returns` — Devoluciones
- `wishlist` — Favoritos
- `order_events` — Eventos de orden (auditoría)
- `whatsapp_carts` — Carritos vía WhatsApp
- `wallet_accounts` — Billeteras
- `wallet_transactions` — Transacciones

## Migraciones Supabase

14 migrations: `001_initial.sql` → `014_mvp_enhancements.sql`
(Cupones, tax, shipping, reseñas, devoluciones, inventario, analytics, wishlist, índices, RLS policies)

## Total

- ~55 rutas en `src/app/`
- ~72 componentes en `src/components/`
- 22 server actions en `src/server/actions/`

## Estrategia de Integración

Según la Orden Maestra de Unificación, la integración será vía APIs y Eventos, manteniendo bases de datos independientes. ZAFIRO (identidad) se comunicará con Marketplace (comercio) a través de:
- API endpoints compartidos
- Eventos webhook
- Perfiles ZAFIRO como fuente de verdad para usuarios

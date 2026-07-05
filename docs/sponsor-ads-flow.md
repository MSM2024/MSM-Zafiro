# Flujo de publicidad y sponsors

## Principio

La publicidad no debe destruir la simplicidad del producto.

Regla:

> La publicidad debe parecer patrocinio de conocimiento, no spam.

## Donde aparece

No debe tapar:

- Buscador.
- Respuesta IA.
- Navegacion.
- Botones principales.
- IA de esquina.

Formatos permitidos:

- Ticker superior obligatorio para usuarios gratuitos.
- Barra patrocinada dentro del flujo.
- Tarjeta patrocinada por categoria.
- Sponsor de comunidad.
- Recomendacion de curso/herramienta marcada como `Sponsored`.

## Ticker superior obligatorio

Para monetizacion simple, la plataforma puede usar una barra superior de sponsors.

Reglas:

- Siempre marcada como `Sponsored`.
- Movimiento continuo, tipo ticker.
- No debe bloquear botones.
- No debe tapar respuestas.
- No debe mezclarse con respuestas de IA o comunidad.
- Usuarios premium pueden tener opcion sin anuncios.

En Estados Unidos se puede describir como mandatory sponsored placement para usuarios free.

## Flujo autoservicio

1. Sponsor crea campana.
2. Escribe marca, categoria, texto y presupuesto.
3. IA analiza el anuncio.
4. Si cumple reglas, se aprueba automaticamente.
5. Si no cumple, pide cambios.
6. Si aprueba, abre Stripe Checkout.
7. Stripe cobra.
8. Webhook activa la campana.
9. La campana aparece marcada como patrocinada.

## Analisis IA

La IA revisa:

- Spam.
- Promesas falsas.
- Riesgo medico/legal/financiero.
- Contenido sexual o peligroso.
- Relevancia con categoria.
- Claridad del mensaje.
- Si parece respuesta organica enganosa.

## Stripe

Stripe maneja:

- Pago unico de campana.
- Suscripcion de sponsor mensual.
- Facturas.
- Cupones.
- Webhooks.

Tablas sugeridas:

### sponsor_campaigns

- id
- sponsor_user_id
- brand_name
- category_id
- ad_copy
- budget_cents
- status: draft, ai_review, approved, rejected, paid, active, paused, ended
- ai_review_reason
- stripe_checkout_session_id
- stripe_payment_intent_id
- starts_at
- ends_at
- created_at

### sponsor_impressions

- id
- campaign_id
- user_id nullable
- placement
- shown_at

### sponsor_clicks

- id
- campaign_id
- user_id nullable
- placement
- clicked_at

## Planes iniciales

- Starter: 49 USD.
- Growth: 149 USD.
- Scale: 499 USD.

## Regla importante

El anuncio siempre debe estar marcado como patrocinado.

Nunca debe parecer una respuesta real de la comunidad o de la IA.

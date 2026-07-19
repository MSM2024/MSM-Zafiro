# La Mente Maestra — Oferta Editorial

## Estado
- **URL**: `/transforma-tu-vida-con-la-mente-maestra`
- **Checkout**: Pendiente — enlace a MSM Marketplace (msmmystore.com) por definir
- **Precio**: Pendiente — configurable via `NEXT_PUBLIC_MENTE_MAESTRA_PRICE_LABEL`
- **Lista de espera**: Activa — leads almacenados y auditables

## Enlaces Rápidos

| Recurso | Ruta |
|---------|------|
| Landing page | `/transforma-tu-vida-con-la-mente-maestra` |
| Lead API | `POST /api/mente-maestra/leads` |
| Config | `src/lib/mente-maestra/config.ts` |
| Analytics | `src/lib/mente-maestra/analytics.ts` |
| Componentes | `src/components/mente-maestra/` |

## Configuración

| Variable | Propósito | Valor por defecto |
|----------|-----------|-------------------|
| `NEXT_PUBLIC_MENTE_MAESTRA_CHECKOUT_URL` | URL de compra en MSM Marketplace | `""` (→ lista de espera) |
| `NEXT_PUBLIC_MENTE_MAESTRA_PRICE_LABEL` | Texto del precio | `"Próximamente"` |

## Lead API

Endpoint: `POST /api/mente-maestra/leads`

Payload:
```json
{
  "name": "string (2-100 chars)",
  "email": "string (email válido)",
  "country": "string (min 2 chars)",
  "whatsapp": "string? (opcional, max 20)",
  "interest": "string (obligatorio)",
  "consent": true,
  "campaign": "string? (utm_campaign)",
  "medium": "string? (utm_medium)",
  "referral": "string? (document.referrer)"
}
```

Rate limiting: 5 solicitudes por minuto por IP.

## Funnel

1. VISITA → landing page
2. LECTURA → contenido gratuito
3. CLIC CTA → scroll a formulario o checkout
4. LEAD → formulario de interés
5. MARKETPLACE → checkout en msmmystore.com
6. COMPRA CONFIRMADA → evento marketplace.order.completed

## Próximos Pasos

1. [ ] Crear producto en MSM Marketplace (`mente-maestra-fundador`)
2. [ ] Configurar `NEXT_PUBLIC_MENTE_MAESTRA_CHECKOUT_URL`
3. [ ] Configurar `NEXT_PUBLIC_MENTE_MAESTRA_PRICE_LABEL`
4. [ ] Activar feature flag `MENTE_MAESTRA_ENABLED` para rollout progresivo
5. [ ] Publicar testimonios reales con consentimiento
6. [ ] Integrar analytics con dashboard de administración

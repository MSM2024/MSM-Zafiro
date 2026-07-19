# ZAFIRO OS — Event Bus

## Propósito

Sistema de eventos común para comunicación asíncrona entre módulos.

## Estructura de cada Evento

```typescript
interface ZafiroEvent {
  eventId: string
  eventType: string
  version: number
  source: string
  actorId: string
  entityId: string
  operationId: string
  correlationId: string
  timestamp: string
  payload: Record<string, unknown>
  signature: string
}
```

## Eventos de Identity

- `identity.user.created`
- `identity.profile.updated`
- `identity.membership.changed`
- `identity.kyc.updated`
- `identity.kyb.updated`

## Eventos de OS

- `os.app.opened`
- `os.app.installed`
- `os.app.updated`
- `os.notification.created`
- `os.device.connected`

## Eventos de Marketplace

- `marketplace.product.published`
- `marketplace.order.created`
- `marketplace.order.completed`

## Eventos de Editorial

- `editorial.article.published`
- `editorial.book.published`

## Eventos de Economía

- `economy.operation.created`
- `economy.operation.confirmed`
- `economy.daily_close.completed`

## Eventos de ELIANA

- `eliana.action.requested`
- `eliana.action.approved`
- `eliana.action.rejected`

## Eventos de Holo

- `holo.session.created`
- `holo.session.ended`

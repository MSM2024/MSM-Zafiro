# Membresía VIP — ZAFIRO

## Tres niveles

### STANDARD
- Nivel base de todos los usuarios
- Acceso a funcionalidades básicas de la plataforma
- Sin beneficios premium
- Sin costo

### VIP
- Membresía premium individual
- Beneficios exclusivos para el usuario
- Requiere pago activo
- Se activa con `activateVip()` → estado `VIP_PENDING_PAYMENT`

### ENTREPRENEUR_VIP
- Membresía premium para negocios
- Se asigna automáticamente al crear un `businessProfile`
- Incluye beneficios de VIP + funcionalidades empresariales
- Requiere verificación KYB adicional

## Lo que VIP NO habilita automáticamente

La membresía VIP es un nivel de beneficios, **no** una licencia para operaciones financieras reguladas. VIP **NO** habilita:

| Funcionalidad | Requisito adicional |
|---------------|-------------------|
| Pagos regulados | Licencia financiera específica |
| Remesas | Licencia de transferencia de dinero |
| Wallets / billeteras digitales | Cumplimiento regulatorio por jurisdicción |
| Préstamos | Autorización de entidad financiera |
| Intercambio de divisas | Licencia de cambio |
| Servicios de pagamento | Pasarela de pago autorizada |

VIP otorga beneficios de la plataforma (visibilidad, funciones premium, soporte prioritario), pero las operaciones financieras requieren autorizaciones separadas según la jurisdicción.

## Estados VIP

### VIP_PENDING_PAYMENT
- VIP activado, esperando confirmación de pago
- El usuario ve beneficios limitados
- Se activa con `activateVip(profileId)`

### VIP_ACTIVE
- VIP activo y pagado
- Todos los beneficios disponibles
- Se confirma con `confirmVipPayment(profileId)`

### VIP_PAST_DUE
- Pago atrasado
- Beneficios pueden reducirse
- Se requiere acción del usuario para actualizar

### VIP_CANCEL_AT_PERIOD_END
- Cancelación solicitada, activo hasta fin de período
- Se activa con `cancelVip(profileId)`
- Los beneficios se mantienen hasta la fecha de expiración

### VIP_SUSPENDED
- VIP suspendido (por admin o por incumplimiento)
- Se activa con `suspendVip(profileId)`
- Sin beneficios hasta reactivación

### VIP_EXPIRED
- VIP expirado
- Sin beneficios
- Requiere renovación

## Beneficios por nivel

| Beneficio | STANDARD | VIP | ENTREPRENEUR_VIP |
|-----------|----------|-----|-------------------|
| Perfil público | ✓ | ✓ | ✓ |
| Publicaciones | ✓ | ✓ | ✓ |
| Seguir usuarios | ✓ | ✓ | ✓ |
| Explorar contenido | ✓ | ✓ | ✓ |
| Insignia VIP | ✗ | ✓ | ✓ |
| Insignia Emprendedor | ✗ | ✗ | ✓ |
| Marketplace | ✗ | ✓ | ✓ |
| Perfil empresarial | ✗ | ✗ | ✓ |
| Verificación KYB | ✗ | ✗ | ✓ |
| Soporte prioritario | ✗ | ✓ | ✓ |
| Funciones premium | ✗ | ✓ | ✓ |

## Flujo de activación

### Activación de VIP estándar

```
Usuario solicita VIP
    │
    ▼
activateVip(profileId)
    │
    ├── membershipTier → 'VIP'
    └── vipStatus → 'VIP_PENDING_PAYMENT'
    │
    ▼
Proceso de pago (externo)
    │
    ▼
confirmVipPayment(profileId)
    │
    └── vipStatus → 'VIP_ACTIVE'
    │
    ▼
Beneficios VIP activos
```

### Activación de ENTREPRENEUR_VIP

```
Usuario crea perfil empresarial
    │
    ▼
createBusinessProfile(ownerProfileId, legalBusinessName)
    │
    ├── membershipTier → 'ENTREPRENEUR_VIP' (automático)
    └── businessProfile creado con verificationStatus: 'NOT_STARTED'
    │
    ▼
Proceso KYB (verificación empresarial)
```

### Cancelación

```
Usuario solicita cancelación
    │
    ▼
cancelVip(profileId)
    │
    └── vipStatus → 'VIP_CANCEL_AT_PERIOD_END'
    │
    ▼
Beneficios se mantienen hasta fin de período
    │
    ▼
Al expirar → vipStatus → 'VIP_EXPIRED'
```

### Suspensión (por admin)

```
Admin detecta problema
    │
    ▼
suspendVip(profileId) [requiere MFA]
    │
    └── vipStatus → 'VIP_SUSPENDED'
    │
    ▼
Sin beneficios hasta reactivación manual
```

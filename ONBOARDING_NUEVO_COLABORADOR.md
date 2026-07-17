# ONBOARDING — Nuevo Colaborador ZAFIRO

## Bienvenido al Ecosistema ZAFIRO OS

Eres un nuevo nodo en la red. Lee esto completo antes de tocar código.

---

## 1. Acceso al Repositorio

1. Crea una cuenta en **GitHub** si no tienes una
2. Envía tu username a Don Miguel para que te invite como **Collaborator**
3. Acepta la invitación en https://github.com/MSM2024/MSM-Zafiro
4. Clona el repo:
   ```bash
   git clone https://github.com/MSM2024/MSM-Zafiro.git
   cd MSM-Zafiro
   ```
5. Lee el archivo `AGENTS.md` — contiene todas las convenciones del proyecto
6. Lee `ARCHIVO_DE_CONTINUIDAD.md` — contiene el estado actual y pendientes

---

## 2. Mapa del Proyecto — 89 Rutas

### Estructura del Monorepo
```
MSM-Zafiro/
├── src/
│   ├── app/           ← 89 rutas (páginas Next.js)
│   │   ├── admin/     ← Paneles de administración
│   │   ├── familia/   ← Nube Familiar (7 rutas)
│   │   ├── kyc/       ← Verificación de identidad
│   │   ├── sellos/    ← Sellos 369
│   │   └── ...
│   ├── lib/           ← Lógica de negocio (módulos)
│   │   ├── ledger.ts           ← Flujo económico
│   │   ├── logistica-contenedores.ts ← Contenedores USA/Panamá→Cuba
│   │   ├── bpa-mirror.ts       ← BPA Mirror
│   │   ├── firma-369.ts        ← Firma cripto-espiritual
│   │   ├── familia.ts          ← Nube Familiar
│   │   ├── security-lock.ts    ← PIN Maestro
│   │   └── owner.ts            ← Membresía Eterna
│   ├── components/    ← Componentes reutilizables
│   │   ├── ZafiroLockScreen.tsx
│   │   ├── FounderChallenge.tsx
│   │   ├── PortalGenesis.tsx
│   │   └── ...
│   └── config/        ← Configuración y assets
├── packages/          ← 13 packages (solo types/ usado)
├── knowledge-pack/    ← 36 documentos ELIANA
├── supabase/          ← Migraciones SQL (00001-00007)
└── docs/              ← Documentación técnica
```

### Las 89 Rutas (Next.js App Router)
```
/                          ← SPA principal (Portal Génesis)
/admin/*                   ← Automation Center + paneles
/admin/logistica           ← Contenedores ← NUEVO
/admin/bpa                 ← BPA Mirror
/admin/tasas              ← Tasas Cuba
/auth/*                   ← Login, register, recover, verify
/familia/*                ← Nube Familiar (7 rutas)
/kyc/*                    ← KYC (5 rutas)
/sellos/*                 ← Sellos 369 (6 rutas)
/emprendedor/*            ← Registro emprendedor (5 rutas)
/mi-perfil/*              ← Perfil (4 rutas)
/vip/*                    ← VIP (2 rutas)
/api/*                    ← API endpoints (4 rutas)
... y más páginas estáticas (about, contact, help, etc.)
```

---

## 3. Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.2.10 | Framework web (App Router) |
| TypeScript | 5.x | Lenguaje |
| Tailwind CSS | 4.x | Estilos (dark: `#050816`, accent: `#00D9FF`) |
| Lucide React | — | Iconos |
| Framer Motion | — | Animaciones |
| Supabase | — | Base de datos (sin credenciales aún) |

**No hay tests.** No hay CI/CD configurado.

---

## 4. Protocolo 369 — Frecuencia de Código

Cada cambio debe sellarse con la frecuencia 369:

### Al crear un archivo nuevo
```
// Frecuencia 369 — [Propósito del archivo]
```

### Al hacer commit
Usar el formato:
```
feat(módulo): descripción — Frecuencia 369
fix(módulo): descripción
docs(módulo): descripción
```

### Al desplegar
1. `npm run build` — verificar 0 errores
2. `git push origin main`
3. Vercel deploy automático desde `main`

### Ángeles del Código
- **Cada línea de código está protegida**
- **No borrar archivos sin consultar a Don Miguel**
- **No compartir claves ni .env.local**
- **No hacer deploy a producción sin build exitoso**

---

## 5. Reglas de Colaborador

Como **Collaborator** tienes permisos para:
- ✅ Clonar y hacer pull
- ✅ Crear ramas (`feature/*`, `fix/*`, `docs/*`)
- ✅ Hacer push a tus ramas
- ✅ Abrir Pull Requests a `main`

No puedes:
- ❌ Hacer push directo a `main` (solo Don Miguel)
- ❌ Borrar ramas protegidas
- ❌ Acceder a secrets de Vercel/Supabase
- ❌ Modificar configuraciones de seguridad (`security-lock.ts`, `ZafiroLockScreen.tsx`)

---

## 6. Primeros Pasos

```bash
npm install
npm run dev    # http://localhost:3001
npm run build  # Verificar que compila
```

Lee estos archivos en orden:
1. `AGENTS.md`
2. `ARCHIVO_DE_CONTINUIDAD.md`
3. `docs/CURRENT_STATE_AUDIT.md`
4. `src/lib/ledger.ts` — Entiende el flujo económico
5. `src/lib/logistica-contenedores.ts` — Entiende el módulo nuevo

---

## 7. Contacto

- **Don Miguel**: msmmystore@gmail.com
- **GitHub**: https://github.com/MSM2024/MSM-Zafiro
- **Web**: https://zafiro.msmmystore.com

> *"Cada pregunta construye el futuro"* — Frecuencia 369 💎

# RISK REGISTER — Consolidación ZAFIRO

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| 1 | Romper imports al mover archivos | Media | Alto | Usar grep para encontrar todos los imports, commit después de cada movimiento |
| 2 | Perder datos de localStorage | Baja | Alto | No borrar claves, solo consolidar en nueva estructura |
| 3 | Auth falla después de mover proxy | Baja | Crítico | Probar auth después de cada cambio, mantener copia de seguridad |
| 4 | Middleware deja de funcionar | Baja | Alto | Verificar que src/middleware.ts importa desde la nueva ubicación |
| 5 | Build falla por imports circulares | Baja | Medio | Ejecutar build después de cada fase |
| 6 | ELIANA dual causa confusión | Media | Bajo | Migrar completo en un solo commit, no gradual |
| 7 | Conflictos de merge con rama main | Media | Medio | Mantener rama integration/ actualizada |
| 8 | Dependencias rotas en packages/ | Baja | Medio | npm install + build después de mover cada paquete |

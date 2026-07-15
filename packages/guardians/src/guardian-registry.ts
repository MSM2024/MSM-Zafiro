import type { GuardianState } from "../../types/src/zafiro";

export const GUARDIAN_DEFINITIONS = [
  {
    id: "communications",
    name: "Guardián de Comunicaciones",
    description: "Supervisa red, mensajería y sincronización.",
    capabilities: ["network.status", "latency.read", "sync.retry", "message.queue"],
    color: "#0F52BA",
  },
  {
    id: "infrastructure",
    name: "Guardián de Infraestructura",
    description: "Supervisa API, servidores y base de datos.",
    capabilities: ["api.health", "database.health", "service.status", "backup.status"],
    color: "#D4AF37",
  },
  {
    id: "mobility",
    name: "Guardián de Movilidad",
    description: "Supervisa entregas, rutas y ubicación autorizada.",
    capabilities: ["delivery.read", "route.read", "location.authorized"],
    color: "#60A5FA",
  },
  {
    id: "home",
    name: "Guardián del Hogar",
    description: "Supervisa dispositivos y sensores autorizados.",
    capabilities: ["device.read", "sensor.read", "temperature.alert", "battery.status"],
    color: "#10B981",
  },
  {
    id: "multimedia",
    name: "Guardián Multimedia",
    description: "Administra voz, cámara y contenido.",
    capabilities: ["voice.listen", "camera.authorized", "media.stream", "audio.play"],
    color: "#A78BFA",
  },
  {
    id: "security",
    name: "Guardián de Seguridad",
    description: "Protege identidad, permisos y auditoría.",
    capabilities: ["auth.verify", "permission.check", "audit.write", "threat.detect"],
    color: "#F59E0B",
  },
  {
    id: "family",
    name: "Guardián de Familia",
    description: "Administra perfiles, contactos y alertas familiares.",
    capabilities: ["profile.read", "family.alert", "contact.authorized", "wellbeing.check"],
    color: "#EC4899",
  },
] as const;

export function createInitialGuardianState(): GuardianState[] {
  return GUARDIAN_DEFINITIONS.map((guardian) => ({
    id: guardian.id,
    name: guardian.name,
    status: "HEALTHY",
    healthScore: 100,
    alerts: [],
    lastUpdatedAt: new Date().toISOString(),
  }));
}

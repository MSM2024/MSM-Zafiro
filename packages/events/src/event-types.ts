export type ZafiroEventType =
  | "zafiro.boot.started" | "zafiro.boot.completed"
  | "zafiro.voice.activated" | "zafiro.user.authenticated"
  | "zafiro.intent.detected" | "zafiro.action.requested"
  | "zafiro.action.approved" | "zafiro.action.rejected"
  | "zafiro.module.activated" | "zafiro.module.degraded"
  | "zafiro.network.offline" | "zafiro.network.online"
  | "zafiro.sync.started" | "zafiro.sync.completed" | "zafiro.sync.failed"
  | "zafiro.guardian.warning" | "zafiro.guardian.critical"
  | "zafiro.backup.completed" | "zafiro.backup.failed"
  | "economy.sale.created" | "economy.sale.cancelled" | "economy.cash.updated"
  | "inventory.updated" | "inventory.low" | "inventory.out_of_stock"
  | "whatsapp.message.received" | "whatsapp.message.replied";

export interface ZafiroEvent<TPayload = Record<string, unknown>> {
  eventId: string;
  eventType: ZafiroEventType;
  source: string;
  userId?: string;
  deviceId?: string;
  timestamp: string;
  priority: "EMERGENCY" | "SECURITY" | "HEALTH" | "OPERATION" | "COMMUNITY" | "ENTERTAINMENT";
  payload: TPayload;
  signature?: string;
}

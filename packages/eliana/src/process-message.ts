import { FREQUENCY_ORIGIN } from "../../frequency-origin/src/frequency-origin.config";

export interface ElianaInboundMessage {
  messageId: string;
  channel: "WHATSAPP" | "WEB" | "TELEGRAM" | "VOICE";
  contactId: string;
  userId?: string;
  text: string;
  timestamp: string;
}

async function ensureIdempotency(messageId: string): Promise<void> {
  if (typeof window !== "undefined") {
    const processed = JSON.parse(localStorage.getItem("zafiro_eliana_processed") || "[]");
    if (processed.includes(messageId)) throw new Error("DUPLICATE_MESSAGE");
    processed.push(messageId);
    localStorage.setItem("zafiro_eliana_processed", JSON.stringify(processed));
  }
}

function detectLanguage(text: string): string {
  const esChars = /[¿¡áéíóúñü]/i;
  return esChars.test(text) ? "es" : "en";
}

function classifyIntent(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("status") || lower.includes("estado")) return "zafiro.status";
  if (lower.includes("ayuda") || lower.includes("help")) return "zafiro.help";
  if (lower.includes("venta") || lower.includes("sale")) return "economy.sales";
  if (lower.includes("inventario") || lower.includes("inventory")) return "economy.inventory";
  if (lower.includes("caja") || lower.includes("cash") || lower.includes("balance")) return "economy.cash";
  if (lower.includes("sync") || lower.includes("sincronizar")) return "sync.status";
  return "zafiro.unknown";
}

async function loadConversationState(channel: string, contactId: string): Promise<Record<string, unknown>> {
  if (typeof window !== "undefined") {
    const key = `zafiro_conv_${channel}_${contactId}`;
    return JSON.parse(localStorage.getItem(key) || "{}");
  }
  return {};
}

async function saveConversationState(opts: { channel: string; contactId: string; language: string; intent: string; context: Record<string, unknown> }): Promise<void> {
  if (typeof window !== "undefined") {
    const key = `zafiro_conv_${opts.channel}_${opts.contactId}`;
    localStorage.setItem(key, JSON.stringify(opts));
  }
}

type ValidationResult = { allowed: true; publicMessage?: never } | { allowed: false; publicMessage: string };

async function validateRequest(inbound: ElianaInboundMessage, context: unknown): Promise<ValidationResult> {
  return { allowed: true };
}

async function routeIntent(opts: { inbound: ElianaInboundMessage; language: string; intent: string; context: Record<string, unknown> }): Promise<string> {
  return `Intención detectada: ${opts.intent}. Procesando solicitud...`;
}

async function applyResponseSecurity(response: string): Promise<string> {
  return response;
}

async function writeAuditEvent(event: { action: string; entityId: string; result: string }): Promise<void> {
  if (typeof window !== "undefined") {
    const logs = JSON.parse(localStorage.getItem("zafiro_audit_events") || "[]");
    logs.push({ ...event, timestamp: new Date().toISOString() });
    localStorage.setItem("zafiro_audit_events", JSON.stringify(logs));
  }
}

export async function processElianaMessage(
  inbound: ElianaInboundMessage
): Promise<string> {
  await ensureIdempotency(inbound.messageId);
  const language = detectLanguage(inbound.text);
  const intent = classifyIntent(inbound.text);
  const context = await loadConversationState(inbound.channel, inbound.contactId);

  const frequencyContext = { config: FREQUENCY_ORIGIN, language, intent, context };

  const validation = await validateRequest(inbound, frequencyContext);
  if (!validation.allowed) return validation.publicMessage;

  const response = await routeIntent({ inbound, language, intent, context });
  const safeResponse = await applyResponseSecurity(response);

  await saveConversationState({ channel: inbound.channel, contactId: inbound.contactId, language, intent, context });
  await writeAuditEvent({ action: "eliana.response.created", entityId: inbound.messageId, result: "success" });

  return safeResponse;
}

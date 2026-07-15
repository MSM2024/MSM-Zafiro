import type { ZafiroEvent, ZafiroEventType } from "./event-types";

type EventHandler = (event: ZafiroEvent) => Promise<void> | void;

export class ZafiroEventBus {
  private handlers = new Map<ZafiroEventType, Set<EventHandler>>();

  subscribe(eventType: ZafiroEventType, handler: EventHandler): () => void {
    const handlers = this.handlers.get(eventType) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(eventType, handlers);
    return () => { handlers.delete(handler); };
  }

  async publish(event: ZafiroEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) ?? new Set<EventHandler>();
    await Promise.all([...handlers].map(async (handler) => { await handler(event); }));
  }
}

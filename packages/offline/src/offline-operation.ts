export type OfflineOperationState =
  | "GUARDADO" | "PENDIENTE" | "SINCRONIZANDO" | "SINCRONIZADO" | "REQUIERE_REVISION";

export interface OfflineOperation<TPayload = unknown> {
  operationId: string;
  operationType: string;
  payload: TPayload;
  userId: string;
  deviceId: string;
  createdAt: string;
  attempts: number;
  state: OfflineOperationState;
  signature?: string;
  lastError?: string;
}

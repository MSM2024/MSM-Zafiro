export type PaymentMethod = 'usdt' | 'venmo'

export interface PaymentConfig {
  method: PaymentMethod
  label: string
  description: string
  icon: string
  qrData: string
  walletAddress?: string
  network?: string
  instructions: string[]
  warning?: string
}

export type QrStatus = 'QR_LOADING' | 'QR_READY' | 'QR_UNAVAILABLE' | 'QR_INVALID' | 'QR_VERIFIED'

export const PAYMENT_METHODS: Record<PaymentMethod, PaymentConfig> = {
  usdt: {
    method: 'usdt',
    label: 'USDT (TRC-20)',
    description: 'Paga con USDT en la red TRC-20',
    icon: '💰',
    qrData: 'usdt:TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLu6?amount=100&network=TRC20',
    walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLu6',
    network: 'TRC-20 (Tron)',
    instructions: [
      'Abre tu wallet de USDT (Trust Wallet, Binance, MetaMask, etc.)',
      'Selecciona la red TRC-20',
      'Escanea el código QR o copia la dirección',
      'Ingresa el monto exacto del producto/servicio',
      'Confirma la transacción',
    ],
    warning: '⚠️ Solo enviar USDT en red TRC-20. Otras redes pueden resultar en pérdida de fondos.',
  },
  venmo: {
    method: 'venmo',
    label: 'Venmo',
    description: 'Paga con Venmo escaneando el código QR',
    icon: '💳',
    qrData: 'venmo:https://venmo.com/u/MSM-MYSTORE',
    instructions: [
      'Abre la aplicación Venmo en tu teléfono',
      'Selecciona la opción "Escanear código QR"',
      'Escanea el código QR de esta pantalla',
      'Verifica los datos del destinatario: @MSM-MYSTORE',
      'Ingresa el monto y confirma el pago',
    ],
  },
}

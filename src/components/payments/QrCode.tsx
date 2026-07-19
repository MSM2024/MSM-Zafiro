'use client'

import { useEffect, useRef, useState } from "react"
import QRCodeLib from "qrcode"
import type { QrStatus } from "@/lib/payments/config"

interface Props {
  data: string
  size?: number
  status?: QrStatus
  onStatusChange?: (status: QrStatus) => void
}

export default function QrCode({ data, size = 360, status, onStatusChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [localStatus, setLocalStatus] = useState<QrStatus>(status || 'QR_LOADING')

  useEffect(() => {
    if (!canvasRef.current) return
    setLocalStatus('QR_LOADING')
    onStatusChange?.('QR_LOADING')

    QRCodeLib.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 4,
      color: {
        dark: '#0A1628',
        light: '#FFFFFF',
      },
    }, (err) => {
      if (err) {
        setLocalStatus('QR_INVALID')
        onStatusChange?.('QR_INVALID')
        return
      }
      setLocalStatus('QR_READY')
      onStatusChange?.('QR_READY')
    })
  }, [data, size, onStatusChange])

  if (localStatus === 'QR_LOADING' && !canvasRef.current) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="w-8 h-8 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block"
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
        borderRadius: 0,
      }}
    />
  )
}

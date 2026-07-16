'use client'

import { useEffect } from "react"
import { initAuthBridge } from "@/lib/auth-bridge"

export default function AuthBridgeInit() {
  useEffect(() => {
    initAuthBridge()
  }, [])
  return null
}

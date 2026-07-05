import { createHash, randomBytes } from "crypto"

export function generateOTP(length = 6): string {
  let otp = ""
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString()
  }
  return otp
}

export function hashOTP(code: string): string {
  return createHash("sha256").update(code).digest("hex")
}

export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(randomBytes(4).toString("hex").toUpperCase().slice(0, 8))
  }
  return codes
}

export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(c => createHash("sha256").update(c).digest("hex"))
}

export function deviceFingerprint(ua: string, ip: string, screen: string): string {
  const raw = `${ua}|${ip}|${screen}`
  return createHash("sha256").update(raw).digest("hex")
}

export function trustScoreChange(current: number, event: "good_vote" | "report_validated" | "login" | "report_filed" | "suspicious_activity" | "new_account"): number {
  const deltas: Record<string, number> = {
    good_vote: 2,
    report_validated: 5,
    login: 1,
    report_filed: -5,
    suspicious_activity: -15,
    new_account: 0,
  }
  return Math.max(0, Math.min(100, current + (deltas[event] || 0)))
}

export function rateLimitMax(trustScore: number): { votes_per_hour: number; questions_per_day: number; messages_per_hour: number } {
  if (trustScore >= 80) return { votes_per_hour: 60, questions_per_day: 20, messages_per_hour: 30 }
  if (trustScore >= 50) return { votes_per_hour: 30, questions_per_day: 10, messages_per_hour: 15 }
  if (trustScore >= 20) return { votes_per_hour: 10, questions_per_day: 5, messages_per_hour: 5 }
  return { votes_per_hour: 5, questions_per_day: 2, messages_per_hour: 2 }
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

export function generateTOTPSecret(): string {
  const bytes = randomBytes(20)
  let secret = ""
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32[bytes[i] % 32]
  }
  return secret
}

export function getTOTPURL(secret: string, email: string): string {
  return `otpauth://totp/MSM%20Zafiro:${encodeURIComponent(email)}?secret=${secret}&issuer=MSM%20Zafiro&algorithm=SHA1&digits=6&period=30`
}

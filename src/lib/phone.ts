export interface CarrierInfo {
  name: string
  country: string
  countryCode: string
  prefixes: string[]
}

export const CARRIERS: CarrierInfo[] = [
  // México
  { name: "Telcel", country: "México", countryCode: "52", prefixes: ["55", "56", "44", "33", "81", "66", "22", "55", "56", "44", "33", "81", "66", "22", "1", "2", "3"] },
  { name: "Movistar", country: "México", countryCode: "52", prefixes: ["55", "56", "44", "33", "81"] },
  { name: "AT&T", country: "México", countryCode: "52", prefixes: ["55", "56", "44", "33", "81"] },
  { name: "Altan", country: "México", countryCode: "52", prefixes: ["55", "56", "44", "33", "81"] },
  // USA/Canadá
  { name: "T-Mobile", country: "USA", countryCode: "1", prefixes: ["2", "3", "4", "5", "6", "7", "8", "9"] },
  { name: "Verizon", country: "USA", countryCode: "1", prefixes: ["2", "3", "4", "5", "6", "7", "8", "9"] },
  { name: "AT&T", country: "USA", countryCode: "1", prefixes: ["2", "3", "4", "5", "6", "7", "8", "9"] },
  // España
  { name: "Movistar", country: "España", countryCode: "34", prefixes: ["6", "7"] },
  { name: "Vodafone", country: "España", countryCode: "34", prefixes: ["6", "7"] },
  { name: "Orange", country: "España", countryCode: "34", prefixes: ["6", "7"] },
  // Colombia
  { name: "Claro", country: "Colombia", countryCode: "57", prefixes: ["3"] },
  { name: "Tigo", country: "Colombia", countryCode: "57", prefixes: ["3"] },
  { name: "Movistar", country: "Colombia", countryCode: "57", prefixes: ["3"] },
  // Argentina
  { name: "Claro", country: "Argentina", countryCode: "54", prefixes: ["1", "2", "3"] },
  { name: "Movistar", country: "Argentina", countryCode: "54", prefixes: ["1", "2", "3"] },
  { name: "Personal", country: "Argentina", countryCode: "54", prefixes: ["1", "2", "3"] },
  // Chile
  { name: "Entel", country: "Chile", countryCode: "56", prefixes: ["9"] },
  { name: "Movistar", country: "Chile", countryCode: "56", prefixes: ["9"] },
  { name: "Claro", country: "Chile", countryCode: "56", prefixes: ["9"] },
  // Perú
  { name: "Claro", country: "Perú", countryCode: "51", prefixes: ["9"] },
  { name: "Movistar", country: "Perú", countryCode: "51", prefixes: ["9"] },
  { name: "Entel", country: "Perú", countryCode: "51", prefixes: ["9"] },
]

export const COUNTRY_CODES = [
  { code: "52", name: "México", flag: "🇲🇽" },
  { code: "1", name: "USA/Canadá", flag: "🇺🇸" },
  { code: "34", name: "España", flag: "🇪🇸" },
  { code: "57", name: "Colombia", flag: "🇨🇴" },
  { code: "54", name: "Argentina", flag: "🇦🇷" },
  { code: "56", name: "Chile", flag: "🇨🇱" },
  { code: "51", name: "Perú", flag: "🇵🇪" },
  { code: "58", name: "Venezuela", flag: "🇻🇪" },
  { code: "593", name: "Ecuador", flag: "🇪🇨" },
  { code: "502", name: "Guatemala", flag: "🇬🇹" },
  { code: "503", name: "El Salvador", flag: "🇸🇻" },
  { code: "504", name: "Honduras", flag: "🇭🇳" },
  { code: "505", name: "Nicaragua", flag: "🇳🇮" },
  { code: "506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "507", name: "Panamá", flag: "🇵🇦" },
  { code: "53", name: "Cuba", flag: "🇨🇺" },
  { code: "1-809", name: "Rep. Dominicana", flag: "🇩🇴" },
  { code: "598", name: "Uruguay", flag: "🇺🇾" },
  { code: "595", name: "Paraguay", flag: "🇵🇾" },
  { code: "591", name: "Bolivia", flag: "🇧🇴" },
]

export function detectCarrier(phone: string, countryCode: string): CarrierInfo | null {
  const digits = phone.replace(/\D/g, "")
  const localNumber = countryCode === "52" ? digits.slice(2) : digits.slice(countryCode.length)
  for (const carrier of CARRIERS) {
    if (carrier.countryCode !== countryCode) continue
    for (const prefix of carrier.prefixes) {
      if (localNumber.startsWith(prefix)) return carrier
    }
  }
  return null
}

export function formatPhone(phone: string, countryCode: string): string {
  const digits = phone.replace(/\D/g, "")
  const full = countryCode + digits
  if (countryCode === "52" && digits.length === 10) {
    return `+52 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  if (countryCode === "1" && digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return `+${full}`
}

export function validatePhone(phone: string, countryCode: string): boolean {
  const digits = phone.replace(/\D/g, "")
  if (countryCode === "52" && digits.length === 10) return true
  if (countryCode === "1" && digits.length === 10) return true
  if (countryCode === "34" && digits.length === 9) return true
  if (digits.length >= 7 && digits.length <= 12) return true
  return false
}

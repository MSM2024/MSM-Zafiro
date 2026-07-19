export const EMAIL_CLEANER = {
  trustedDomains: [
    'google.com', 'gmail.com',
    'vercel.com', 'supabase.com',
    'stripe.com',
    'facebook.com', 'meta.com', 'whatsapp.com',
    'msmmystore.com', 'msmmystore.org',
  ],
  trustedEmails: [
    'cm8msm@gmail.com',
    'msmmystore@gmail.com',
  ],
  analysisLimits: {
    maxMessagesPerCategory: 500,
    largeMessageThresholdMB: 10,
    oldMessageThresholdDays: 180,
  },
  labels: {
    spamReview: 'ZAFIRO_SPAM_REVISAR',
    promotions: 'ZAFIRO_PROMOCIONES',
    largeFiles: 'ZAFIRO_ARCHIVOS_GRANDES',
    important: 'ZAFIRO_IMPORTANTE',
  },
}

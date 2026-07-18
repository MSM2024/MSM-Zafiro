# ZAFIRO Blockers

## Critical (blocks P1 features)
| Blocker | Impact | Workaround |
|---------|--------|------------|
| Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, etc.) | Auth, DB, RLS — entire identity system | localStorage fallback active |
| VERCEL_OIDC_TOKEN exposed in .env.local | Security risk for deployments | Needs rotation from Vercel Dashboard |
| No test suite configured | Cannot run automated tests | Manual Preview testing only |

## High (blocks specific features)
| Blocker | Impact | Workaround |
|---------|--------|------------|
| GOOGLE_OAUTH_CLIENT_ID not configured | Email Cleaner Gmail integration | Gmail connection disabled |
| Stripe keys not live | Payment processing | Demo/stub mode |
| Meta WhatsApp tokens not configured | WhatsApp message sending | Webhook verification only |
| Gemini/OpenAI/Anthropic keys not configured | ELIANA AI provider | Local RAG + fallback responses |

## Low
| Blocker | Impact | Workaround |
|---------|--------|------------|
| blog.msmmystore.com not integrated | MSM Editorial | Separate domain, no integration yet |
| msmmystore.com not integrated | Marketplace catalog | Separate platform |
| No SMS provider configured | Phone verification | Email-only verification |
| No email provider configured | Transactional emails | Console logging only |

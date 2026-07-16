# Subdomain Setup Report — zafiro.msmmystore.com

## Current Status: 🔴 NOT CONFIGURED

## DNS Configuration Required

### Step 1 — Cloudflare DNS Record
| Type | Name | Value | TTL | Proxy Status |
|------|------|-------|-----|-------------|
| A | `zafiro` | `76.76.21.21` | Auto | DNS Only (grey cloud) |

### Step 2 — Vercel Project Assignment
| Field | Value |
|-------|-------|
| Project | `zafiro-os-1-0-0` |
| Project ID | `prj_B1Mvz1NVUbjOp3BexRqyKxmPcSMt` |
| Team | `msmmystore` |
| Environment | Production |

### Step 3 — Vercel Authentication
**Must be disabled** in Vercel Dashboard:
1. Go to `https://vercel.com/msmmystore/zafiro-os-1-0-0/settings`
2. Find "Deployment Protection"
3. Disable "Vercel Authentication"

## Verification Checklist
- [ ] DNS A record created at Cloudflare
- [ ] DNS propagated (TTL expired)
- [ ] Vercel domain verified
- [ ] SSL certificate issued
- [ ] HTTPS accessible from browser
- [ ] HTTP → HTTPS redirect working
- [ ] Same version as Vercel deployment URL

## Rollback
- Delete A record `zafiro.msmmystore.com` from Cloudflare
- Remove domain from Vercel project settings
- Optionally reassign to `msm` project

---
*Report generated: 2026-07-15*

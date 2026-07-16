# DNS Backup — Before ZAFIRO Subdomain Setup

## Domain Information
| Field | Value |
|-------|-------|
| Domain | `msmmystore.com` |
| Registrar | Third Party (Cloudflare) |
| Owner | MSM MY STORE LLC |
| Created | 2026-06-29 |
| Edge Network | Enabled on Vercel |

## Nameservers
| Type | Intended (Vercel) | Current (Cloudflare) | Status |
|------|-------------------|---------------------|--------|
| NS | `ns1.vercel-dns.com` | `brianna.ns.cloudflare.com` | ❌ Not configured |
| NS | `ns2.vercel-dns.com` | `sri.ns.cloudflare.com` | ❌ Not configured |

## Existing Subdomain Aliases (Vercel)
| Subdomain | Target Project | Vercel URL | Status |
|-----------|---------------|------------|--------|
| `zafiro.msmmystore.com` | `msm` (PREVIOUSLY — alias removed) | `msm-805899dib-msmmystore.vercel.app` | ❌ Removed |

## Vercel Projects
| Project | ID | Created | Root |
|---------|----|---------|------|
| `zafiro-os-1-0-0` | `prj_B1Mvz1NVUbjOp3BexRqyKxmPcSMt` | 2026-07-05 | `.` |
| `msm` | — | — | — |

## Recent Deployments — `zafiro-os-1-0-0`
| # | URL | Status | Environment | Date |
|---|-----|--------|-------------|------|
| 1 | `zafiro-os-1-0-0-n6ownexkv-msmmystore.vercel.app` | ✅ Ready | Production | 2026-07-15 |
| 2 | `zafiro-os-1-0-0-bl49j1nwl-msmmystore.vercel.app` | ✅ Ready | Production | 2026-07-15 |
| 3 | `zafiro-os-1-0-0-krwopzr3q-msmmystore.vercel.app` | ✅ Ready | Production | 2026-07-15 |

## Security Status
| Check | Status | Notes |
|-------|--------|-------|
| HTTPS | ❌ Blocked | Vercel Authentication enabled on team |
| SSL Certificate | ❌ Not issued | DNS not pointed to Vercel |
| HTTP→HTTPS | ❌ N/A | Domain not configured |
| HSTS | ❌ N/A | — |
| CSP | ❌ N/A | — |

## Action Required
1. Add `A` record at Cloudflare: `zafiro.msmmystore.com → 76.76.21.21`
2. Disable Vercel Authentication in team settings
3. Assign domain to `zafiro-os-1-0-0` project
4. Verify SSL certificate issuance
5. Confirm public access

## Rollback Plan
- Remove the `A` record for `zafiro.msmmystore.com`
- Reassign the alias back to `msm` project if needed
- Keep all existing MX, SPF, DKIM, DMARC records untouched

---
*Backup created: 2026-07-15*
*Authorized by: Miguel Soria Martínez — MSM MY STORE LLC*

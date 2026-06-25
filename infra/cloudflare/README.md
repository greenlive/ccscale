# Cloudflare IaC + dashboard imports

Two ways to apply the same config:

## A. Terraform (recommended for reproducible infra)

```bash
cd infra/cloudflare/terraform

# 1. Set up state backend (Cloudflare R2 recommended)
# See commented backend block in main.tf

# 2. Copy tfvars
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with real values

# 3. Apply
terraform init
terraform plan -out tfplan
terraform apply tfplan
```

Provisions:
- DNS: apex, www, admin, api, media, mail MX, SPF, DMARC, DKIM
- Zone settings: SSL=full_strict, TLS 1.2+, HSTS preload, Brotli, HTTP/3, 0-RTT
- Redirect rule: ccscale.com -> www.ccscale.com (301)
- Cache rules: R2 media (30d), _next/static (1y immutable)
- WAF: Bot Fight Mode
- Rate limit: 10 POST /api/inquiries per 60s per IP

## B. Dashboard manual import

1. **DNS** (Cloudflare Dashboard > DNS > Records > Advanced > Import BIND zone file)
   Use `dashboard-import-bind.txt`. Replace placeholders first.

2. **Rules** (Cloudflare Dashboard > Rules > Overview)
   Recreate the entries in `dashboard-rules-import.json` manually, OR
   apply via API:

   ```bash
   curl -X POST -H "Authorization: Bearer <CF_TOKEN>" \
        -H "Content-Type: application/json" \
        --data @dashboard-rules-import.json \
        https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/rulesets
   ```

3. **Zone settings** (Cloudflare Dashboard > SSL/TLS > Overview)
   - SSL/TLS > Full (Strict)
   - Edge Certificates > Always Use HTTPS = ON
   - Edge Certificates > Minimum TLS Version = 1.2
   - Edge Certificates > HTTP/3 (with QUIC) = ON
   - Edge Certificates > 0-RTT = ON
   - Speed > Optimization > Brotli = ON
   - Security > Settings > HSTS = enable, max-age 31536000, includeSubDomains, preload

## Verification

```bash
# DNS
dig +short www.ccscale.com
dig +short api.ccscale.com
dig +short media.ccscale.com

# SSL
curl -I https://www.ccscale.com 2>&1 | grep -i "strict-transport-security|x-frame|x-content"

# HSTS preload
curl -sI https://www.ccscale.com | grep -i "strict-transport-security"

# Performance
# https://gtmetrix.com or https://www.webpagetest.org
```
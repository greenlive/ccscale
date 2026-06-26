# Cloudflare IaC for CC Scale
# Apply with:
#   cd infra/cloudflare/terraform
#   terraform init
#   terraform plan -out tfplan
#   terraform apply tfplan
#
# Requires:
#   - CLOUDFLARE_API_TOKEN env var (scoped to zone:zzscale.com)
#   - terraform >= 1.5

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.40"
    }
  }
  # Recommended: store state in Cloudflare R2 or Terraform Cloud
  # backend "s3" {
  #   bucket                      = "zzscale-tfstate"
  #   key                         = "cloudflare/terraform.tfstate"
  #   region                      = "auto"
  #   endpoint                    = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
  #   access_key                  = var.r2_access_key_id
  #   secret_key                  = var.r2_secret_access_key
  #   skip_credentials_validation = true
  #   skip_metadata_api_check     = true
  # }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "Cloudflare API token (Zone:DNS:Edit, Zone:Page Rules:Edit, Account:Turnstile:Edit)"
}

variable "zone_id" {
  type        = string
  description = "Cloudflare Zone ID for zzscale.com"
}

variable "vercel_web_cname" {
  type        = string
  default     = "cname.vercel-dns.com"
  description = "Vercel-provided CNAME target for www"
}

variable "vercel_admin_cname" {
  type        = string
  default     = "cname.vercel-dns.com"
  description = "Vercel-provided CNAME target for admin"
}

variable "railway_cname" {
  type        = string
  default     = "<service>.up.railway.app"
  description = "Railway-provided CNAME for api"
}

variable "r2_public_cname" {
  type        = string
  default     = "media.zzscale.com.cdn.cloudflare.net"
  description = "Cloudflare-provided CNAME for R2 public bucket"
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 1. DNS records
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
locals {
  zone_name = "zzscale.com"
}

# Root: 301 -> www
resource "cloudflare_record" "root_apex" {
  zone_id = var.zone_id
  name    = "@"
  type    = "A"
  content = "192.0.2.1" # RFC 5737 placeholder; redirect rule below does the work
  proxied = true
  comment = "apex - actual redirect handled by Rules > Redirect Rules"
}

# www -> Vercel
resource "cloudflare_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  type    = "CNAME"
  content = var.vercel_web_cname
  proxied = true
  comment = "Marketing site (Next.js on Vercel)"
}

# admin -> Vercel (independent project)
resource "cloudflare_record" "admin" {
  zone_id = var.zone_id
  name    = "admin"
  type    = "CNAME"
  content = var.vercel_admin_cname
  proxied = true
  comment = "Admin UI (Vercel)"
}

# api -> Railway
resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  type    = "CNAME"
  content = var.railway_cname
  proxied = true
  comment = "NestJS API"
}

# media -> R2 (public bucket)
resource "cloudflare_record" "media" {
  zone_id = var.zone_id
  name    = "media"
  type    = "CNAME"
  content = var.r2_public_cname
  proxied = true
  comment = "Cloudflare R2 public bucket"
}

# mail (MX) - for Resend
resource "cloudflare_record" "mx_resend_feedback" {
  zone_id  = var.zone_id
  name     = "@"
  type     = "MX"
  content  = "feedback-smtp.us-east-1.amazonses.com"
  priority = 10
  comment  = "Resend inbound (https://resend.com/docs/dashboard/domains/introduction)"
}

# SPF
resource "cloudflare_record" "spf" {
  zone_id = var.zone_id
  name    = "@"
  type    = "TXT"
  content = "v=spf1 include:amazonses.com ~all"
  comment = "SPF for Resend"
}

# DMARC
resource "cloudflare_record" "dmarc" {
  zone_id = var.zone_id
  name    = "_dmarc"
  type    = "TXT"
  content = "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@zzscale.com; pct=100"
  comment = "DMARC policy"
}

# Resend DKIM (replace with values from Resend dashboard)
resource "cloudflare_record" "dkim_resend" {
  zone_id  = var.zone_id
  name     = "resend._domainkey"
  type     = "CNAME"
  content  = "resend._domainkey.amazonses.com"
  proxied = false
  comment  = "DKIM (replace content with Resend-provided value)"
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 2. Zone settings
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = var.zone_id
  setting_id = "ssl"
  value      = "full_strict" # not "flexible"
}

resource "cloudflare_zone_setting" "always_https" {
  zone_id    = var.zone_id
  setting_id = "always_https"
  value      = "on"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = "1.2" # TLS 1.2 minimum
}

resource "cloudflare_zone_setting" "tls_1_3" {
  zone_id    = var.zone_id
  setting_id = "tls_1_3"
  value      = "zrt"
}

resource "cloudflare_zone_setting" "brotli" {
  zone_id    = var.zone_id
  setting_id = "brotli"
  value      = "on"
}

resource "cloudflare_zone_setting" "http3" {
  zone_id    = var.zone_id
  setting_id = "http3"
  value      = "on"
}

resource "cloudflare_zone_setting" "early_hints" {
  zone_id    = var.zone_id
  setting_id = "early_hints"
  value      = "on"
}

resource "cloudflare_zone_setting" "0rtt" {
  zone_id    = var.zone_id
  setting_id = "0rtt"
  value      = "on"
}

resource "cloudflare_zone_setting" "security_header" {
  zone_id    = var.zone_id
  setting_id = "security_header"
  value = {
    strict_transport_security = {
      enabled            = true
      max_age            = 31536000
      include_subdomains = true
      preload            = true
      nosniff            = true
    }
  }
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 3. Redirect Rules (root -> www)
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
resource "cloudflare_ruleset" "root_redirect" {
  zone_id = var.zone_id
  name    = "redirect-root-to-www"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules {
    action = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          value = "https://www.zzscale.com${uri}"
        }
        preserve_query_string = true
      }
    }
    expression  = "(http.host eq \"zzscale.com\")"
    description = "Redirect apex to www"
    enabled     = true
  }
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 4. Cache rules
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
resource "cloudflare_ruleset" "cache_uploads" {
  zone_id = var.zone_id
  name    = "cache-uploads"
  kind    = "zone"
  phase   = "http_request_cache_settings"

  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = 2592000 # 30 days
      }
      browser_ttl {
        mode = "override_origin"
        value = 2592000
      }
      serve_stale = { enable = true }
    }
    expression  = "(http.host eq \"media.zzscale.com\")"
    description = "Aggressively cache R2 media"
    enabled     = true
  }
}

resource "cloudflare_ruleset" "cache_next_static" {
  zone_id = var.zone_id
  name    = "cache-next-static"
  kind    = "zone"
  phase   = "http_request_cache_settings"

  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = 31536000 # 1 year (immutable)
      }
      browser_ttl {
        mode = "override_origin"
        value = 31536000
      }
    }
    expression  = "(http.host eq \"www.zzscale.com\" and http.request.uri.path starts_with \"/_next/static/\")"
    description = "Cache _next/static forever (immutable)"
    enabled     = true
  }
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 5. WAF / Bot Fight / Rate limit
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
resource "cloudflare_ruleset" "bot_fight" {
  zone_id = var.zone_id
  name    = "bot-fight-mode"
  kind    = "zone"
  phase   = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "4814384a9e5d4991b9815dcfc25d2f1f" # Bot Fight Mode (managed)
    }
    expression  = "true"
    description = "Enable Bot Fight Mode"
    enabled     = true
  }
}

# Rate limit: protect /api/inquiries and /api/auth
resource "cloudflare_ruleset" "rate_limit_inquiry" {
  zone_id = var.zone_id
  name    = "rate-limit-inquiry"
  kind    = "zone"
  phase   = "http_ratelimit"

  rules {
    action = "block"
    action_parameters {
      response = {
        status_code = 429
        content_type = "application/json"
        body = jsonencode({ error = "Too many requests" })
      }
    }
    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60
      requests_per_period = 10
      mitigation_timeout  = 600
    }
    expression  = "(http.host eq \"api.zzscale.com\" and http.request.uri.path eq \"/api/inquiries\" and http.request.method eq \"POST\")"
    description = "Inquiry POST 10/min/IP"
    enabled     = true
  }
}

# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
# 6. Output
# 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
output "nameservers" {
  value = cloudflare_record.root_apex.zone_id # not actually NS list; use data source
}

output "config_summary" {
  value = {
    ssl            = cloudflare_zone_setting.ssl.value
    min_tls        = cloudflare_zone_setting.min_tls_version.value
    hsts_preload   = true
    apex_redirect  = "zzscale.com -> https://www.zzscale.com"
    www_target     = var.vercel_web_cname
    admin_target   = var.vercel_admin_cname
    api_target     = var.railway_cname
    media_target   = var.r2_public_cname
    rate_limit     = "10 POST /api/inquiries per 60s per IP"
    bot_fight      = "on"
  }
}
# variables.tf - placeholder; values are passed via terraform.tfvars or -var flags

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "Cloudflare API token"
}

variable "zone_id" {
  type        = string
  description = "Cloudflare Zone ID for ccscale.com"
}

variable "vercel_web_cname" {
  type    = string
  default = "cname.vercel-dns.com"
}

variable "vercel_admin_cname" {
  type    = string
  default = "cname.vercel-dns.com"
}

variable "railway_cname" {
  type        = string
  description = "Railway-provided CNAME for api (e.g. <service>.up.railway.app)"
}

variable "r2_public_cname" {
  type    = string
  default = "media.ccscale.com.cdn.cloudflare.net"
}
# env-vault/

1Password import + secrets management for CC Scale production.

## Files

- 1password-import.csv - Item list (placeholder values). Import into 1Password, then fill in real secrets.
- ../.env.example - Canonical env var template. Use op inject -i .env.example -o .env to fill at deploy time.

## Workflow

### 1. One-time setup

 + "" + ` + "" + ` + "" + ash
# install 1Password CLI (https://developer.1password.com/docs/cli)
op signin

# create the vault
op vault create 'CC Scale - Production'

# import the CSV (skips #-prefixed comment lines)
op import items --vault='CC Scale - Production' 1password-import.csv
 + "" + ` + "" + ` + "" + 

### 2. Fill secrets

Open 1Password desktop, navigate to the vault, and replace each  + "" + __PLACEHOLDER__ + "" +  with the real value:

- Run  + "" + openssl rand -base64 48 + "" +  twice for  + "" + JWT_SECRET + "" +  and  + "" + COOKIE_SECRET + "" + 
- Copy Cloudflare API token from https://dash.cloudflare.com/profile/api-tokens
- Copy Vercel token from https://vercel.com/account/tokens
- Copy Railway token from https://railway.app/account/tokens
- Copy Neon connection strings from the Neon console (pooled + unpooled)
- Copy Upstash REST URL + token from the Upstash console
- Create R2 access key at https://dash.cloudflare.com/?to=/:account/r2/api-tokens
- Create Resend API key at https://resend.com/api-keys
- Create Sentry DSN at https://sentry.io/settings/cc-scale/projects/cc-scale-web/keys/
- Get GA4 ID from https://analytics.google.com/ (Admin then Data Streams then Measurement ID)

### 3. Inject at deploy time

 + "" + ` + "" + ` + "" + ash
# local: fill .env from 1Password
op inject -i .env.example -o .env

# Railway: link 1Password CLI plugin
# https://docs.railway.app/reference/cli#using-1password
railway variables set --from-file .env

# Vercel: pull from 1Password
vercel env pull .env.local
# (then manually map or use the 1Password Vercel integration)
 + "" + ` + "" + ` + "" + 

### 4. Rotate secrets quarterly

- Update values in 1Password
- Re-run  + "" + ailway variables set --from-file .env + "" +  and  + "" + ercel env rm <NAME> && vercel env add <NAME> production + "" + 
- Sentry / Cloudflare tokens: rotate via the platform's UI

## Security

- **Never commit** a filled-in CSV. Use placeholders in this repo.
- **Never paste** secrets into Slack / email.
- All team members who deploy should have their own 1Password account; share the vault, not the secrets.
- Enable 1Password 'Watchtower' alerts for leaked credentials.
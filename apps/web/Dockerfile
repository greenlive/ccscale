# =============================================================================
# CC Scale Web Dockerfile - Optimized Production Build
# Multi-stage build for Next.js 14 app with performance optimizations
# =============================================================================

# ---------- Stage 1: Dependencies ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Copy package files from monorepo root
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/ 2>/dev/null || true
COPY packages/i18n/package.json ./packages/i18n/ 2>/dev/null || true
COPY packages/shared-types/package.json ./packages/shared-types/ 2>/dev/null || true
COPY packages/database/package.json ./packages/database/ 2>/dev/null || true
COPY turbo.json ./

# Use npm ci with optimizations
RUN npm ci --prefer-offline --no-audit --progress=false --legacy-peer-deps

# ---------- Stage 2: Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (override at deploy time)
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENV=production
ARG NEXT_PUBLIC_WEB_URL=https://www.zzscale.com

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=
ENV NEXT_PUBLIC_GTM_ID=
ENV NEXT_PUBLIC_SENTRY_DSN=
ENV NEXT_PUBLIC_SENTRY_ENV=
ENV NEXT_PUBLIC_WEB_URL=
ENV NEXT_TELEMETRY_DISABLED=1

# Enable Next.js standalone output for smaller image
ENV NEXT_OUTPUT standalone

# Build only the web app with optimizations
RUN npm run build --filter=@cc-scale/web 2>&1 | tee /tmp/build.log

# ---------- Stage 3: Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Install curl for healthcheck
RUN apk add --no-cache dumb-init curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed at runtime
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copy build log for debugging
COPY --from=builder /tmp/build.log /app/build.log

# Use dumb-init to handle signals properly
USER nextjs

EXPOSE 3000

# Health check with proper status code validation
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/en || curl -f http://localhost:3000/health || exit 1

# Use dumb-init to prevent zombie processes
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "apps/web/server.js"]
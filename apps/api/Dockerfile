# CC Scale API Dockerfile (NestJS)
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/ 2>/dev/null || true
COPY packages/shared-types/package.json ./packages/shared-types/ 2>/dev/null || true
COPY turbo.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo run build --filter=@cc-scale/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=deps /app/node_modules ./node_modules

USER nodejs
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/health || exit 1
CMD ["node", "apps/api/dist/main.js"]
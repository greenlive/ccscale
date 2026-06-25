# GitHub Actions Deployment Guide

This directory contains Vercel CI/CD configuration.

## Setup Instructions

### 1. Add GitHub Secrets

In your GitHub repository: Settings - Secrets and variables - Actions

Add these secrets:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- NEXT_PUBLIC_API_URL

### 2. Create Vercel Token

1. Login to Vercel
2. Go to Settings - Tokens
3. Create new token

### 3. Get Vercel Org and Project IDs

Run this after linking locally:
`ash
cd apps/web
vercel link
cat .vercel/project.json
`

### 4. Manual deploy-web.yml Template

Save this as .github/workflows/deploy-web.yml:

`yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm install -g vercel
      - run: vercel pull --yes --environment=production
        env:
          VERCEL_ORG_ID: dollars/secrets.VERCEL_ORG_ID
          VERCEL_PROJECT_ID: dollars/secrets.VERCEL_PROJECT_ID
      - run: vercel build --prod
        env:
          VERCEL_ORG_ID: dollars/secrets.VERCEL_ORG_ID
          VERCEL_PROJECT_ID: dollars/secrets.VERCEL_PROJECT_ID
          NEXT_PUBLIC_API_URL: dollars/secrets.NEXT_PUBLIC_API_URL
      - run: vercel deploy --prebuilt --prod
        env:
          VERCEL_ORG_ID: dollars/secrets.VERCEL_ORG_ID
          VERCEL_PROJECT_ID: dollars/secrets.VERCEL_PROJECT_ID
`

Note: Replace dollars with $ in the YAML file.

For detailed deployment instructions, see DEPLOYMENT.md in the project root.
#!/bin/bash
# =============================================================================
# CC Scale Web 前端部署脚本 (Vercel)
# =============================================================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e ""======================================""
echo -e ""  CC Scale Web 部署脚本 (Vercel)  ""
echo -e ""======================================""

# 检查环境变量
if [ -z """" ]; then
    echo -e ""错误: 请提供 Vercel API Token""
    echo ""使用方式: ./deploy-web.sh <VERCEL_TOKEN> [PRODUCTION]""
    exit 1
fi

VERCEL_TOKEN=
DEPLOY_ENV=  # 'production' 或留空

echo ""检测到工作目录: D:\program_self_develop\b2b\by_codex""
echo ""Node 版本: v25.8.1""
echo ""npm 版本: 11.12.0""

# 安装 Vercel CLI
echo -e ""安装 Vercel CLI...""
npm install -g vercel

# 设置 token
vercel login || true
vercel tokens create --scopes full-access 2>/dev/null || true

# 配置项目
cd apps/web

echo -e ""链接到 Vercel 项目...""
if [ """" = ""production"" ]; then
    echo -e ""部署到生产环境...""
    vercel --prod --token= \
        --yes \
        --build-env NEXT_PUBLIC_API_URL=
else
    echo -e ""部署到预览环境...""
    vercel --token= \
        --yes \
        --build-env NEXT_PUBLIC_API_URL=
fi

echo -e ""======================================""
echo -e ""  部署完成！  ""
echo -e ""======================================""
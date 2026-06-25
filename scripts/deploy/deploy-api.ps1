# =============================================================================
# CC Scale API 后端部署脚本 (Railway)
# PowerShell 版本
# =============================================================================

param(
    [string],
    [switch]
)

 = ""e[0;31m""
 = ""e[0;32m""
 = ""e[1;33m""
 = ""e[0m""

Write-Host ""======================================""
Write-Host ""  CC Scale API 部署脚本 (Railway)  ""
Write-Host ""======================================""

# 检查 Railway CLI
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host ""安装 Railway CLI...""
    npm install -g @railway/cli
}

# 登录 Railway
Write-Host ""登录 Railway...""
railway login

# 选择项目
Write-Host ""选择 Railway 项目...""
railway project select

# 部署
Set-Location ""/../../apps/api""

Write-Host ""部署到 Railway...""
if () {
    railway up --production
} else {
    railway up
}

# 显示日志
Write-Host ""查看最近 50 行日志...""
railway logs --tail 50

# 获取 URL
try {
     = railway domain
    Write-Host ""API URL: ""
} catch {
    Write-Host ""域名尚未分配，请在 Railway Dashboard 中设置""
}

Write-Host ""======================================""
Write-Host ""  部署完成！  ""
Write-Host ""======================================""
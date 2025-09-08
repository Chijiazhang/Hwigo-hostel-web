Write-Host "正在启动青旅网站开发服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "请确保已安装Node.js和npm" -ForegroundColor Yellow
Write-Host ""

# 检查Node.js是否安装
try {
    $nodeVersion = node --version
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Blue
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm是否安装
try {
    $npmVersion = npm --version
    Write-Host "npm版本: $npmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "错误: 未找到npm" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "正在检查依赖..." -ForegroundColor Yellow

# 检查并安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "安装依赖中..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
} else {
    Write-Host "依赖已安装" -ForegroundColor Green
}

Write-Host ""
Write-Host "启动开发服务器..." -ForegroundColor Green
Write-Host "网站将在 http://localhost:3000 运行" -ForegroundColor Cyan
Write-Host "登录页面: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "调试页面: http://localhost:3000/debug" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动开发服务器
npm run dev

Write-Host ""
Write-Host "服务器已停止" -ForegroundColor Yellow
Read-Host "按回车键退出"















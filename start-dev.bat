@echo off
echo 正在启动青旅网站开发服务器...
echo.
echo 请确保已安装Node.js和npm
echo.
echo 正在检查依赖...
if not exist "node_modules" (
    echo 安装依赖中...
    npm install
) else (
    echo 依赖已安装
)
echo.
echo 启动开发服务器...
echo 网站将在 http://localhost:3000 运行
echo 登录页面: http://localhost:3000/login
echo 调试页面: http://localhost:3000/debug
echo.
echo 按 Ctrl+C 停止服务器
echo.
npm run dev
pause















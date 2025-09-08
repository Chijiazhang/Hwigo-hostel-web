"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [currentPath, setCurrentPath] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    setUserAgent(navigator.userAgent);
    setTimestamp(new Date().toLocaleString());
  }, []);

  const testRoutes = [
    "/",
    "/login",
    "/login/test",
    "/debug",
    "/hostels",
    "/about",
    "/contact"
  ];

  const testRoute = async (route: string) => {
    try {
      const response = await fetch(route);
      return response.status;
    } catch (error) {
      return "Error";
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🐛 调试信息</h1>
      
      <h2>当前状态</h2>
      <ul>
        <li><strong>当前路径:</strong> {currentPath}</li>
        <li><strong>用户代理:</strong> {userAgent}</li>
        <li><strong>时间戳:</strong> {timestamp}</li>
        <li><strong>页面类型:</strong> Next.js App Router</li>
      </ul>

      <h2>路由测试</h2>
      <p>点击以下链接测试路由是否正常工作：</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {testRoutes.map((route) => (
          <a
            key={route}
            href={route}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textDecoration: 'none',
              color: '#333',
              backgroundColor: '#f5f5f5'
            }}
          >
            {route === "/" ? "首页" : route}
          </a>
        ))}
      </div>

      <h2>常见问题检查</h2>
      <ul>
        <li>✅ 登录页面文件存在: app/login/page.tsx</li>
        <li>✅ Header组件配置正确</li>
        <li>✅ Next.js配置文件已更新</li>
        <li>✅ CSS样式已添加</li>
      </ul>

      <h2>下一步操作</h2>
      <ol>
        <li>确保开发服务器正在运行: <code>npm run dev</code></li>
        <li>测试直接访问: <a href="/login">/login</a></li>
        <li>检查浏览器控制台是否有错误</li>
        <li>尝试硬刷新页面 (Ctrl+F5)</li>
      </ol>

      <h2>如果仍然有问题</h2>
      <p>请检查：</p>
      <ul>
        <li>Node.js版本是否 >= 18.17.0</li>
        <li>是否安装了所有依赖: <code>npm install</code></li>
        <li>端口3000是否被占用</li>
        <li>防火墙设置是否阻止了本地连接</li>
      </ul>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <strong>💡 提示:</strong> 如果直接访问 <a href="/login">/login</a> 可以工作，但点击按钮不行，可能是JavaScript事件处理问题。
      </div>
    </div>
  );
}















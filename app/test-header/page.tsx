"use client";

import Header from "../../components/Header";
import { useFavorites } from "../../contexts/FavoriteContext";

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function TestHeaderPage() {
  const { isLoggedIn, user } = useFavorites();

  return (
    <div>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Header测试页面</h1>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">当前状态：</h2>
          <p>登录状态: {isLoggedIn ? "已登录" : "未登录"}</p>
          <p>用户信息: {user ? JSON.stringify(user, null, 2) : "无"}</p>
        </div>
      </div>
    </div>
  );
}

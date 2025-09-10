"use client";

import { useFavorites } from "../../contexts/FavoriteContext";

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function DebugPage() {
  const { isLoggedIn, user, favorites } = useFavorites();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">调试页面</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">登录状态</h2>
          <p>是否已登录: {isLoggedIn ? "是" : "否"}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">用户信息</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">收藏列表</h2>
          <p>收藏数量: {favorites.length}</p>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(favorites, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">LocalStorage</h2>
          <p>user-logged-in: {typeof window !== 'undefined' ? localStorage.getItem('user-logged-in') : 'N/A'}</p>
          <p>user-info: {typeof window !== 'undefined' ? localStorage.getItem('user-info') : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
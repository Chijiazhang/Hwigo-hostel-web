"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BirdIcon } from "../../components/ui/bird-icon";
import { useFavorites, UserInfo } from "../../contexts/FavoriteContext";

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn } = useFavorites();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的登录验证（实际项目中应该连接后端API）
    if (email && password) {
      // 创建用户信息（实际项目中应该从API获取）
      const userInfo: UserInfo = {
        id: Date.now().toString(),
        nickname: email.split('@')[0], // 使用邮箱前缀作为昵称
        email: email,
        avatar: `https://i.pravatar.cc/32?img=${Math.floor(Math.random() * 70)}`
      };
      
      // 设置登录状态和用户信息
      setLoggedIn(true, userInfo);
      alert('登录成功！');
      // 跳转到首页
      window.location.href = '/';
    } else {
      alert('请填写完整的登录信息');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(60%_40%_at_70%_10%,#dbeafe_0%,transparent_60%),radial-gradient(50%_60%_at_10%_20%,#fef3c7_0%,transparent_60%),linear-gradient(180deg,#ffffff, #f8fafc)]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b border-white/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-flex size-7 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 items-center justify-center overflow-hidden">
            <img 
              src="/bird-logo.svg" 
              alt="Hwigo Hostel Logo" 
              className="size-6 object-contain"
            />
          </span>
          Hwigo Hostel
        </a>
        </div>
      </header>

      {/* 登录表单 */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-none bg-white/80 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                欢迎回来
              </CardTitle>
              <p className="text-center text-sm text-gray-600 mt-1">
                登录你的青旅账户
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">邮箱</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                    <Mail className="size-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="输入邮箱"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">密码</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                    <Lock className="size-4 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入密码"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
                <p className="text-center text-sm text-gray-500">
                  还没有账号？ <a href="/register" className="text-blue-600 hover:underline">立即注册</a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Hwigo Hostel
      </footer>
    </div>
  );
}

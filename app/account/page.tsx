"use client"

import React, { useState, useEffect } from "react";

// 强制动态渲染
export const dynamic = 'force-dynamic';
import {
  Sparkles,
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Plus,
  Trash2,
  ShieldCheck,
  Heart,
  MapPin,
  Eye
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useFavorites } from "../../contexts/FavoriteContext";

export default function AccountPage() {
  // 收藏功能和用户信息
  const { favorites, removeFromFavorites, user, isLoggedIn } = useFavorites();
  
  // 账户资料 - 使用Context中的用户信息
  const [avatar, setAvatar] = useState(user?.avatar || "https://i.pravatar.cc/120?img=13");
  const [nickname, setNickname] = useState(user?.nickname || "旅客");
  const [fullName, setFullName] = useState(user?.nickname || "User");
  const [email, setEmail] = useState(user?.email || "user@example.com");
  const [phone, setPhone] = useState("+34 600 000 000");

  // 当用户信息变化时更新本地状态
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "https://i.pravatar.cc/120?img=13");
      setNickname(user.nickname || "旅客");
      setFullName(user.nickname || "User");
      setEmail(user.email || "user@example.com");
    }
  }, [user]);

  // 支付方式（演示）
  const [cards, setCards] = useState([
    { id: "c1", brand: "VISA", last4: "4242", exp: "08/27", primary: true },
    { id: "c2", brand: "MasterCard", last4: "2211", exp: "11/26", primary: false },
  ]);

  // 安全设置
  const [pwdOld, setPwdOld] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdNew2, setPwdNew2] = useState("");
  const mismatch = Boolean(pwdNew && pwdNew2 && pwdNew !== pwdNew2);

  // 处理收藏项查看
  const handleViewFavorite = (id: string) => {
    window.location.href = `/hotel-detail?id=${id}`;
  };

  // 处理收藏项移除
  const handleRemoveFavorite = (id: string) => {
    if (confirm('确定要移除这个收藏吗？')) {
      removeFromFavorites(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-xl font-bold text-gray-900">青年旅馆</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">首页</a>
              <a href="/hostels" className="text-gray-700 hover:text-blue-600 transition-colors">所有旅馆</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">关于我们</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">联系我们</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人账户</h1>
          <p className="text-gray-600">管理您的账户信息、收藏和设置</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：账户信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 个人资料 */}
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserIcon className="size-5 text-blue-600"/>
                  个人资料
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">头像</label>
                    <div className="flex items-center space-x-4">
                      <img src={avatar} alt="用户头像" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"/>
                      <Button variant="outline" size="sm">更换头像</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                    <input 
                      type="text" 
                      value={nickname} 
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">保存更改</Button>
                </div>
              </CardContent>
            </Card>

            {/* 收藏列表 */}
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="size-5 text-red-500"/>
                  我的收藏
                </h2>
                {favorites.length > 0 ? (
                  <div className="space-y-3">
                    {favorites.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img src={item.cover} alt={item.name} className="w-16 h-16 rounded-lg object-cover"/>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="size-3"/>
                            {item.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-yellow-600">★ {item.rating}</span>
                            <span className="text-sm text-gray-500">({item.reviews} 评价)</span>
                            <span className="text-sm font-medium text-green-600">¥{item.price}/晚</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewFavorite(item.id)}
                          >
                            查看
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveFavorite(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            移除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="size-12 mx-auto mb-3 text-gray-300"/>
                    <p>还没有收藏任何旅馆</p>
                    <p className="text-sm">去探索一些有趣的旅馆吧！</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 安全设置 */}
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-green-600"/>
                  安全设置
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                    <input 
                      type="password" 
                      value={pwdOld} 
                      onChange={(e) => setPwdOld(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                    <input 
                      type="password" 
                      value={pwdNew} 
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                    <input 
                      type="password" 
                      value={pwdNew2} 
                      onChange={(e) => setPwdNew2(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        mismatch ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {mismatch && <p className="text-sm text-red-600 mt-1">两次输入的密码不一致</p>}
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!pwdOld || !pwdNew || !pwdNew2 || mismatch}
                  >
                    修改密码
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：快捷操作 */}
          <div className="space-y-6">
            {/* 账户概览 */}
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">账户概览</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">会员等级</span>
                    <span className="font-medium">普通会员</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">收藏数量</span>
                    <span className="font-medium">{favorites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">注册时间</span>
                    <span className="font-medium">2024年1月</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <Card className="border border-gray-100">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">快捷操作</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="size-4 mr-2"/>
                    消息中心
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="size-4 mr-2"/>
                    支付管理
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShieldCheck className="size-4 mr-2"/>
                    隐私设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

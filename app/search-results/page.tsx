"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, MapPin, ArrowUpDown, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BirdIcon } from "@/components/ui/bird-icon";

// 模拟数据 - 按城市分类
const mockHotelsData = {
  "马德里": [
    {
      id: "madrid-1",
      name: "青旅·马德里中心店",
      location: "Gran Vía, Madrid",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 55,
        "2025-09-13": 60,
        "2025-09-14": 58,
      },
      rating: 4.6,
      reviews: 842,
    },
    {
      id: "madrid-2",
      name: "青年驿站·太阳门店",
      location: "Puerta del Sol, Madrid",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 45,
        "2025-09-13": 50,
        "2025-09-14": 52,
      },
      rating: 4.4,
      reviews: 506,
    },
    {
      id: "madrid-3",
      name: "城市青旅·丽池公园店",
      location: "Parque del Retiro, Madrid",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 70,
        "2025-09-13": 68,
        "2025-09-14": 72,
      },
      rating: 4.8,
      reviews: 1102,
    },
    {
      id: "madrid-4",
      name: "背包客之家·普拉多店",
      location: "Paseo del Prado, Madrid",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 40,
        "2025-09-13": 42,
        "2025-09-14": 45,
      },
      rating: 4.3,
      reviews: 387,
    },
    {
      id: "madrid-5",
      name: "艺术青旅·萨拉曼卡店",
      location: "Salamanca, Madrid",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 65,
        "2025-09-13": 70,
        "2025-09-14": 68,
      },
      rating: 4.7,
      reviews: 623,
    },
  ],
  "巴塞罗那": [
    {
      id: "barcelona-1",
      name: "青旅·巴塞罗那海滩店",
      location: "Barceloneta, Barcelona",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 65,
        "2025-09-13": 70,
        "2025-09-14": 68,
      },
      rating: 4.7,
      reviews: 892,
    },
    {
      id: "barcelona-2",
      name: "高迪青旅·圣家堂店",
      location: "Sagrada Familia, Barcelona",
      image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 75,
        "2025-09-13": 80,
        "2025-09-14": 78,
      },
      rating: 4.9,
      reviews: 1203,
    },
    {
      id: "barcelona-3",
      name: "哥特区青旅·老城区店",
      location: "Gothic Quarter, Barcelona",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 55,
        "2025-09-13": 60,
        "2025-09-14": 58,
      },
      rating: 4.5,
      reviews: 678,
    },
  ],
  "瓦伦西亚": [
    {
      id: "valencia-1",
      name: "青旅·瓦伦西亚艺术科学城店",
      location: "Ciudad de las Artes, Valencia",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 50,
        "2025-09-13": 55,
        "2025-09-14": 52,
      },
      rating: 4.4,
      reviews: 445,
    },
    {
      id: "valencia-2",
      name: "老城区青旅·大教堂店",
      location: "Catedral, Valencia",
      image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 45,
        "2025-09-13": 50,
        "2025-09-14": 48,
      },
      rating: 4.3,
      reviews: 389,
    },
  ],
  "塞维利亚": [
    {
      id: "sevilla-1",
      name: "青旅·塞维利亚大教堂店",
      location: "Catedral, Sevilla",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 60,
        "2025-09-13": 65,
        "2025-09-14": 62,
      },
      rating: 4.6,
      reviews: 567,
    },
    {
      id: "sevilla-2",
      name: "弗拉门戈青旅·圣十字区店",
      location: "Santa Cruz, Sevilla",
      image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 55,
        "2025-09-13": 60,
        "2025-09-14": 58,
      },
      rating: 4.5,
      reviews: 423,
    },
  ],
  "格拉纳达": [
    {
      id: "granada-1",
      name: "青旅·格拉纳达阿尔罕布拉宫店",
      location: "Alhambra, Granada",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 70,
        "2025-09-13": 75,
        "2025-09-14": 72,
      },
      rating: 4.8,
      reviews: 789,
    },
    {
      id: "granada-2",
      name: "阿尔拜辛青旅·老城区店",
      location: "Albaicín, Granada",
      image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=800&auto=format&fit=crop",
      prices: {
        "2025-09-12": 65,
        "2025-09-13": 70,
        "2025-09-14": 68,
      },
      rating: 4.7,
      reviews: 634,
    },
  ],
};

function totalPrice(hotel: any, nights: string[]) {
  return nights.reduce((acc, d) => acc + (hotel.prices[d] || 0), 0);
}

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthed, setIsAuthed] = useState(false);
  const [user] = useState<{name: string; avatar: string}>({
    name: "旅客张三",
    avatar: "https://i.pravatar.cc/100?img=13",
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // 从URL参数获取搜索条件
  const city = searchParams.get('city') || '马德里';
  const checkin = searchParams.get('checkin') || '2025-09-12';
  const checkout = searchParams.get('checkout') || '2025-09-14';
  const guests = searchParams.get('guests') || '1';
  
  // 计算入住天数
  const nights = useMemo(() => {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const days = [];
    const current = new Date(start);
    
    while (current < end) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [checkin, checkout]);
  
  // 根据城市获取对应的旅店数据
  const mockHotels = mockHotelsData[city as keyof typeof mockHotelsData] || mockHotelsData["马德里"];

  const sortedHotels = useMemo(() => {
    const list = [...mockHotels];
    list.sort((a, b) => {
      const sumA = totalPrice(a, nights);
      const sumB = totalPrice(b, nights);
      return sortOrder === "asc" ? sumA - sumB : sumB - sumA;
    });
    return list;
  }, [sortOrder, nights]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
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

          <div className="flex items-center gap-3">
            {!isAuthed ? (
              <Button onClick={() => router.push('/login')} className="px-4">登录</Button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </header>

                {/* 搜索信息展示 */}
          <section className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-gray-100">
            <div className="mx-auto max-w-6xl px-4 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{city}住宿搜索结果</h1>
                  <p className="text-gray-600 mt-1">
                    入住：{new Date(checkin).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })} | 
                    退房：{new Date(checkout).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })} | 
                    共{nights.length}晚 | {guests}人
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">找到 {mockHotels.length} 家青旅</p>
                  <p className="text-lg font-semibold text-gray-900">
                    价格区间：€{Math.min(...mockHotels.map(h => totalPrice(h, nights)))} - €{Math.max(...mockHotels.map(h => totalPrice(h, nights)))}
                  </p>
                </div>
              </div>
            </div>
          </section>

                {/* 排序条 */}
          <section className="border-b border-gray-100 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 text-sm"
                >
                  <ArrowUpDown className="size-4" />
                  {sortOrder === "asc" ? "价格从低到高" : "价格从高到低"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="text-sm"
                >
                  返回首页重新搜索
                </Button>
              </div>
            </div>
          </section>

      {/* 酒店列表 */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        {sortedHotels.map((hotel, idx) => {
          const total = totalPrice(hotel, nights);
          return (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
            >
              <Card className="border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* 左：图片 */}
                  <div className="md:w-[240px] w-full shrink-0">
                    <div className="w-full h-[160px] md:h-[160px] bg-gray-100">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* 中：信息 */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold leading-snug">{hotel.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="size-4" /> {hotel.location}
                        </p>
                        <p className="mt-2 text-sm text-amber-600 inline-flex items-center gap-1">
                          <Star className="size-4" /> {hotel.rating.toFixed(1)}
                          <span className="text-gray-500 text-xs">（{hotel.reviews} 条评价）</span>
                        </p>
                        
                        {/* 每日价格明细 */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {nights.map((night) => (
                            <span key={night} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {new Date(night).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}: €{hotel.prices[night] || '暂无'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右：价格和预订 */}
                  <div className="md:w-[240px] border-t md:border-t-0 md:border-l border-gray-100 p-4 flex md:flex-col items-center md:items-end gap-3 md:gap-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">共 {nights.length} 晚总价</div>
                      <div className="text-2xl font-extrabold text-gray-900">€{total}</div>
                      <div className="text-xs text-gray-500">平均每晚 €{(total / nights.length).toFixed(0)}</div>
                    </div>
                    <Button className="md:w-full" asChild>
                      <a href={`/hotel-detail?id=${hotel.id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`}>查看房型 / 预订</a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </main>

      {/* 底部 */}
      <footer className="py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Hwigo Hostel
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Shield,
  Leaf,
  Users,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Heart
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BirdIcon } from "../../components/ui/bird-icon";
import { useFavorites } from "../../contexts/FavoriteContext";

// 强制动态渲染
export const dynamic = 'force-dynamic';

// —— 工具函数 ——
function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function parseYmd(s: string) {
  const t = s.replace(/\//g, "-");
  const [y, m, d] = t.split("-").map(Number);
  return new Date(y, (m as number) - 1, d);
}
function isWeekend(d: Date) {
  const w = d.getDay();
  return w === 0 || w === 6;
}
function rangeDays(a: string, b: string) {
  if (!a || !b) return [] as Date[];
  const from = parseYmd(a);
  const to = parseYmd(b);
  const arr: Date[] = [];
  const cur = new Date(from);
  while (cur < to) {
    arr.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return arr;
}

// —— 酒店数据（可对接后端） ——
const HOTELS_DATA = {
  "madrid-1": {
    id: "madrid-1",
    name: "青旅·马德里中心店",
    location: "Gran Vía, Madrid",
    rating: 4.6,
    reviews: 842,
    gallery: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "公共厨房" },
      { icon: Shield, label: "门禁安保" },
      { icon: Leaf, label: "环保清洁" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 55, desc: "带隐私帘与阅读灯" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 60, desc: "仅女生入住、更安静" },
      { id: "double", name: "标准双人房", capacity: 2, base: 198, desc: "带独立卫浴，可开窗" },
    ],
  },
  "madrid-2": {
    id: "madrid-2",
    name: "青年驿站·太阳门店",
    location: "Puerta del Sol, Madrid",
    rating: 4.4,
    reviews: 506,
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "24小时前台" },
      { icon: Shield, label: "行李寄存" },
      { icon: Leaf, label: "空调设备" },
    ],
    rooms: [
      { id: "mix8", name: "8 人混合床位", capacity: 1, base: 45, desc: "宽敞空间，储物柜" },
      { id: "female6", name: "6 人女生间", capacity: 1, base: 50, desc: "女生专用，更安全" },
      { id: "twin", name: "标准双床房", capacity: 2, base: 120, desc: "两张单人床，共享卫浴" },
    ],
  },
  "barcelona-1": {
    id: "barcelona-1",
    name: "青旅·巴塞罗那海滩店",
    location: "Barceloneta, Barcelona",
    rating: 4.7,
    reviews: 892,
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "海滩步行5分钟" },
      { icon: Shield, label: "安全门禁" },
      { icon: Leaf, label: "屋顶露台" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 65, desc: "海景床位，空调" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 70, desc: "女生专用，海景" },
      { id: "double", name: "海景双人房", capacity: 2, base: 180, desc: "海景阳台，独立卫浴" },
    ],
  },
  "barcelona-2": {
    id: "barcelona-2",
    name: "高迪青旅·圣家堂店",
    location: "Sagrada Familia, Barcelona",
    rating: 4.9,
    reviews: 1203,
    gallery: [
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "艺术氛围" },
      { icon: Shield, label: "24小时安保" },
      { icon: Leaf, label: "高迪主题装饰" },
    ],
    rooms: [
      { id: "mix4", name: "4 人混合床位", capacity: 1, base: 75, desc: "艺术主题，高迪风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 80, desc: "女生专用，艺术装饰" },
      { id: "suite", name: "高迪套房", capacity: 2, base: 220, desc: "主题套房，独立卫浴" },
    ],
  },
  "valencia-1": {
    id: "valencia-1",
    name: "青旅·瓦伦西亚艺术科学城店",
    location: "Ciudad de las Artes, Valencia",
    rating: 4.4,
    reviews: 445,
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "现代设计" },
      { icon: Shield, label: "智能门锁" },
      { icon: Leaf, label: "环保材料" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 50, desc: "现代设计，科技感" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 55, desc: "女生专用，现代风格" },
      { id: "double", name: "现代双人房", capacity: 2, base: 140, desc: "现代设计，独立卫浴" },
    ],
  },
  "sevilla-1": {
    id: "sevilla-1",
    name: "青旅·塞维利亚大教堂店",
    location: "Catedral, Sevilla",
    rating: 4.6,
    reviews: 567,
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "历史建筑" },
      { icon: Shield, label: "传统安保" },
      { icon: Leaf, label: "庭院花园" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 60, desc: "历史建筑，传统风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 65, desc: "女生专用，庭院景观" },
      { id: "double", name: "传统双人房", capacity: 2, base: 160, desc: "传统装饰，独立卫浴" },
    ],
  },
  "granada-1": {
    id: "granada-1",
    name: "青旅·格拉纳达阿尔罕布拉宫店",
    location: "Alhambra, Granada",
    rating: 4.8,
    reviews: 789,
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "摩尔风格" },
      { icon: Shield, label: "山景位置" },
      { icon: Leaf, label: "花园露台" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 70, desc: "山景床位，摩尔风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 75, desc: "女生专用，山景" },
      { id: "suite", name: "摩尔套房", capacity: 2, base: 200, desc: "摩尔装饰，山景阳台" },
    ],
  },
  // 额外的酒店数据
  "madrid-3": {
    id: "madrid-3",
    name: "城市青旅·丽池公园店",
    location: "Parque del Retiro, Madrid",
    rating: 4.8,
    reviews: 1102,
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "公园景观" },
      { icon: Shield, label: "24小时安保" },
      { icon: Leaf, label: "绿色环保" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 70, desc: "公园景观，安静环境" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 68, desc: "女生专用，公园景观" },
      { id: "double", name: "景观双人房", capacity: 2, base: 180, desc: "公园景观，独立卫浴" },
    ],
  },
  "madrid-4": {
    id: "madrid-4",
    name: "背包客之家·普拉多店",
    location: "Paseo del Prado, Madrid",
    rating: 4.3,
    reviews: 387,
    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "艺术氛围" },
      { icon: Shield, label: "经济实惠" },
      { icon: Leaf, label: "背包客友好" },
    ],
    rooms: [
      { id: "mix8", name: "8 人混合床位", capacity: 1, base: 40, desc: "经济实惠，背包客首选" },
      { id: "female6", name: "6 人女生间", capacity: 1, base: 42, desc: "女生专用，经济实惠" },
      { id: "twin", name: "经济双床房", capacity: 2, base: 100, desc: "两张单人床，共享卫浴" },
    ],
  },
  "madrid-5": {
    id: "madrid-5",
    name: "艺术青旅·萨拉曼卡店",
    location: "Salamanca, Madrid",
    rating: 4.7,
    reviews: 623,
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "艺术装饰" },
      { icon: Shield, label: "高端安保" },
      { icon: Leaf, label: "精品服务" },
    ],
    rooms: [
      { id: "mix4", name: "4 人混合床位", capacity: 1, base: 65, desc: "艺术装饰，精品服务" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 70, desc: "女生专用，艺术装饰" },
      { id: "suite", name: "艺术套房", capacity: 2, base: 190, desc: "艺术主题，独立卫浴" },
    ],
  },
  "barcelona-3": {
    id: "barcelona-3",
    name: "哥特区青旅·老城区店",
    location: "Gothic Quarter, Barcelona",
    rating: 4.5,
    reviews: 678,
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "历史建筑" },
      { icon: Shield, label: "传统安保" },
      { icon: Leaf, label: "哥特风格" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 55, desc: "历史建筑，哥特风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 60, desc: "女生专用，历史氛围" },
      { id: "double", name: "历史双人房", capacity: 2, base: 150, desc: "历史装饰，独立卫浴" },
    ],
  },
  "valencia-2": {
    id: "valencia-2",
    name: "老城区青旅·大教堂店",
    location: "Catedral, Valencia",
    rating: 4.3,
    reviews: 389,
    gallery: [
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "历史建筑" },
      { icon: Shield, label: "传统安保" },
      { icon: Leaf, label: "教堂景观" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 45, desc: "历史建筑，教堂景观" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 50, desc: "女生专用，历史氛围" },
      { id: "double", name: "历史双人房", capacity: 2, base: 120, desc: "历史装饰，独立卫浴" },
    ],
  },
  "sevilla-2": {
    id: "sevilla-2",
    name: "弗拉门戈青旅·圣十字区店",
    location: "Santa Cruz, Sevilla",
    rating: 4.5,
    reviews: 423,
    gallery: [
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "免费 Wi‑Fi" },
      { icon: Coffee, label: "弗拉门戈表演" },
      { icon: Shield, label: "传统安保" },
      { icon: Leaf, label: "安达卢西亚风格" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 55, desc: "弗拉门戈氛围，传统风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 60, desc: "女生专用，传统装饰" },
      { id: "double", name: "传统双人房", capacity: 2, base: 140, desc: "传统装饰，独立卫浴" },
    ],
  },
  "granada-2": {
    id: "granada-2",
    name: "阿尔拜辛青旅·老城区店",
    location: "Albaicín, Granada",
    rating: 4.7,
    reviews: 634,
    gallery: [
      "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      { icon: Wifi, label: "高速 Wi‑Fi" },
      { icon: Coffee, label: "阿尔拜辛风格" },
      { icon: Shield, label: "山景位置" },
      { icon: Leaf, label: "传统庭院" },
    ],
    rooms: [
      { id: "mix6", name: "6 人混合床位", capacity: 1, base: 65, desc: "山景床位，传统风格" },
      { id: "female4", name: "4 人女生间", capacity: 1, base: 70, desc: "女生专用，山景" },
      { id: "double", name: "传统双人房", capacity: 2, base: 180, desc: "传统装饰，山景阳台" },
    ],
  },
};

// 动态价格（示意：周末 +20%，9/13 城市活动 +10%）
function priceForDate(base: number, d: Date) {
  let p = base;
  if (isWeekend(d)) p *= 1.2;
  const event = d.getMonth() === 8 && d.getDate() === 13; // 9 月 13 日
  if (event) p *= 1.1;
  return Math.round(p);
}

function HotelDetailContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('id') || 'madrid-1';
  
  // 从URL参数获取搜索时的日期和人数信息
  const urlCheckIn = searchParams.get('checkin');
  const urlCheckOut = searchParams.get('checkout');
  const urlGuests = searchParams.get('guests');
  
  // 获取酒店数据
  const HOTEL = HOTELS_DATA[hotelId as keyof typeof HOTELS_DATA] || HOTELS_DATA['madrid-1'];
  
  // 收藏功能
  const { addToFavorites, removeFromFavorites, isFavorite, isLoggedIn } = useFavorites();
  
  // 处理收藏操作
  const handleFavoriteToggle = () => {
    if (!isLoggedIn) {
      alert('请先登录后再收藏旅馆');
      return;
    }
    
    const favoriteItem = {
      id: HOTEL.id,
      name: HOTEL.name,
      location: HOTEL.location,
      cover: HOTEL.gallery[0],
      rating: HOTEL.rating,
      reviews: HOTEL.reviews,
      price: HOTEL.rooms[0].base,
      amenities: HOTEL.amenities.map(a => a.label)
    };
    
    if (isFavorite(HOTEL.id)) {
      removeFromFavorites(HOTEL.id);
    } else {
      addToFavorites(favoriteItem);
    }
  };
  
  // 图集
  const [idx, setIdx] = useState(0);
  const curImg = HOTEL.gallery[idx];
  const next = () => setIdx((i) => (i + 1) % HOTEL.gallery.length);
  const prev = () => setIdx((i) => (i - 1 + HOTEL.gallery.length) % HOTEL.gallery.length);

  // 预订控件 - 使用URL参数或默认值
  const today = toDateStr(new Date());
  const tomorrow = toDateStr(new Date(Date.now() + 86400000));
  const [checkIn, setCheckIn] = useState<string>(urlCheckIn || today);
  const [checkOut, setCheckOut] = useState<string>(urlCheckOut || tomorrow);
  const [guests, setGuests] = useState<number>(urlGuests ? parseInt(urlGuests) : 1);
  const [roomId, setRoomId] = useState<string>(HOTEL.rooms[0].id);

  const nights = useMemo(() => rangeDays(checkIn, checkOut), [checkIn, checkOut]);
  const room = HOTEL.rooms.find((r) => r.id === roomId)!;
  const nightly = nights.map((d) => priceForDate(room.base, d));
  const total = nightly.reduce((s, n) => s + n, 0);

  function onCheck() {
    if (!checkIn || !checkOut || nights.length === 0) {
      alert("请选择正确的入住与退房日期");
      return;
    }
    if (guests < 1) {
      alert("人数至少为 1");
      return;
    }
    
    // 检查是否选择了过去的日期
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 重置时间到当天开始
    
    const checkInDate = parseYmd(checkIn);
    const checkOutDate = parseYmd(checkOut);
    
    if (checkInDate && checkInDate < today) {
      alert("不能选择过去的日期作为入住日期");
      return;
    }
    
    if (checkOutDate && checkOutDate < today) {
      alert("不能选择过去的日期作为退房日期");
      return;
    }
    
    // 所有检查通过，可以预订
    // 构建支付页面URL参数
    const params = new URLSearchParams({
      hotelId: hotelId,
      hotelName: HOTEL.name,
      city: HOTEL.location.split(' · ')[0] || 'Madrid',
      checkIn: checkIn,
      checkOut: checkOut,
      roomName: room.name,
      guests: guests.toString(),
      nightly: room.base.toString()
    });
    
    // 跳转到支付页面
    window.location.href = `/checkout?${params.toString()}`;
  }

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
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="size-4"/> {HOTEL.location}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* 图集 */}
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-gray-100">
            <img src={curImg} alt="gallery" className="w-full h-[320px] md:h-[420px] object-cover" />
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
              <ChevronLeft className="size-5"/>
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow">
              <ChevronRight className="size-5"/>
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {HOTEL.gallery.map((g, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`size-2.5 rounded-full ${i===idx? 'bg-white':'bg-white/60'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* 基本信息 + 预订侧栏 */}
        <section className="mt-6 grid lg:grid-cols-[1fr,380px] gap-6">
          {/* 左侧：信息 */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-extrabold">{HOTEL.name}</h1>
                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1"><MapPin className="size-4"/> {HOTEL.location}</p>
                <p className="mt-1 text-amber-600 inline-flex items-center gap-1"><Star className="size-4"/> {HOTEL.rating.toFixed(1)} <span className="text-gray-500 text-xs">（{HOTEL.reviews} 条评价）</span></p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                className={`ml-4 flex items-center gap-2 ${
                  isFavorite(HOTEL.id) 
                    ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`size-4 ${isFavorite(HOTEL.id) ? 'fill-current' : ''}`} 
                />
                {isFavorite(HOTEL.id) ? '已收藏' : '收藏'}
              </Button>
            </div>

            {/* 设施 */}
            <h2 className="mt-6 font-semibold">设施</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              {HOTEL.amenities.map((a, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50">
                  <a.icon className="size-4"/> {a.label}
                </div>
              ))}
            </div>

            {/* 房型列表 */}
            <h2 className="mt-6 font-semibold">房型</h2>
            <div className="mt-3 space-y-3">
              {HOTEL.rooms.map((r) => (
                <Card key={r.id} className={`border ${r.id === roomId ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium flex items-center gap-2"><BedDouble className="size-4"/> {r.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{r.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">每晚起</div>
                      <div className="text-lg font-bold">€{r.base}</div>
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        variant={r.id === roomId ? "default" : "secondary"}
                        onClick={() => setRoomId(r.id)}
                      >
                        {r.id === roomId ? "已选择" : "选择"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 右侧：预订侧栏 */}
          <div>
            <Card className="sticky top-24 border border-gray-100">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">当前房型</div>
                  <div className="font-semibold">{room.name}</div>
                </div>

                {/* 日期选择 */}
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-gray-500">入住
                    <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border bg-white">
                      <Calendar className="size-4 text-gray-500"/>
                      <input type="date" value={checkIn} min={toDateStr(new Date())} onChange={(e)=>{
                        const v = e.target.value;
                        setCheckIn(v);
                        if (checkOut && checkOut <= v) {
                          const d = parseYmd(v); d.setDate(d.getDate()+1); setCheckOut(toDateStr(d));
                        }
                      }} className="w-full bg-transparent outline-none"/>
                    </div>
                  </label>
                  <label className="text-xs text-gray-500">退房
                    <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border bg-white">
                      <Calendar className="size-4 text-gray-500"/>
                      <input type="date" value={checkOut} min={checkIn || toDateStr(new Date())} onChange={(e)=>{
                        const v = e.target.value;
                        if (checkIn && v <= checkIn){
                          const d = parseYmd(checkIn); d.setDate(d.getDate()+1); setCheckOut(toDateStr(d));
                        } else { setCheckOut(v); }
                      }} className="w-full bg-transparent outline-none"/>
                    </div>
                  </label>
                </div>

                {/* 人数 */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">人数</div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                    <Users className="size-4 text-gray-500"/>
                    <input type="number" min={1} value={guests} onChange={(e)=>setGuests(Number(e.target.value)||1)} className="w-full bg-transparent outline-none"/>
                  </div>
                </div>

                {/* 日历价（按所选房型 & 范围计算） */}
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">价格预估</div>
                  {nights.length === 0 ? (
                    <div className="text-sm text-gray-500 mt-2">请选择入住与退房日期</div>
                  ) : (
                    <div className="mt-2">
                      <ul className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto pr-1">
                        {nights.map((d, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>{toDateStr(d)}</span>
                            <span className="font-medium">€{priceForDate(room.base, d)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">共 {nights.length} 晚</span>
                        <span className="text-lg font-extrabold">€{total}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={onCheck}>检查可订</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* 底部 */}
      <footer className="py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4 text-xs text-gray-500">© {new Date().getFullYear()} Hwigo Hostel</div>
      </footer>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <HotelDetailContent />
    </Suspense>
  );
}

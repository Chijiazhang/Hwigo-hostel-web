"use client"

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bed,
  MapPin,
  Calendar,
  Users,
  Wifi,
  Coffee,
  Lock,
  Leaf,
  Sparkles,
  MessageCircle,
  Shield,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BirdIcon } from "@/components/ui/bird-icon";

// —— 小组件 ——
function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full border-none shadow-sm bg-white/70 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-xl bg-gray-100">
              <Icon className="size-5" />
            </span>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RoomCard({label, price, img, bullets}: {label: string; price: number; img: string; bullets: string[]}){
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Card className="overflow-hidden border-none bg-white/80 backdrop-blur shadow-sm h-full flex flex-col">
        <div className="aspect-[4/3] overflow-hidden">
          <img src={img} alt={label} className="w-full h-full object-cover" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="font-semibold">{label}</span>
            <span className="text-sm font-medium text-gray-500">¥{price}/晚起</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col">
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2"><span className="mt-[6px] size-1.5 rounded-full bg-gray-300"/> {b}</li>
            ))}
          </ul>
          <Button className="mt-auto w-full" asChild>
            <a href="/search-results">预订这间</a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// —— 城市数据 ——
const CITIES = [
  "马德里", "巴塞罗那", "瓦伦西亚", "塞维利亚", "格拉纳达", "马拉加", "毕尔巴鄂", "萨拉戈萨",
  "拉斯帕尔马斯", "穆尔西亚", "帕尔马", "科尔多瓦", "阿利坎特", "维戈", "希洪", "拉科鲁尼亚",
  "维多利亚", "格拉纳达", "洛格罗尼奥", "桑坦德", "卡斯特利翁", "阿尔梅里亚", "布尔戈斯", "萨拉曼卡",
  "阿尔巴塞特", "哈恩", "奥维耶多", "巴达霍斯", "雷阿尔城", "卡塞雷斯", "韦尔瓦", "莱昂",
  "加的斯", "卢戈", "奥伦塞", "蓬特韦德拉", "帕伦西亚", "阿维拉", "塞戈维亚", "索里亚",
  "特鲁埃尔", "昆卡", "瓜达拉哈拉", "托莱多", "雷阿尔城", "昆卡", "瓜达拉哈拉", "托莱多"
];

// —— 页面 ——
export default function HostelHome() {
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  
  // 城市搜索相关状态
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 城市搜索和过滤逻辑
  const handleCityInput = (value: string) => {
    setCity(value);
    setSelectedIndex(-1);
    
    if (value.length > 0) {
      const filtered = CITIES.filter(cityName => 
        cityName.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // 最多显示8个建议
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredCities([]);
    }
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCities.length) {
          selectCity(filteredCities[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSearch = () => {
    // 构建搜索参数
    const params = new URLSearchParams({
      city: city,
      checkin: checkin || new Date().toISOString().split('T')[0],
      checkout: checkout || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: guests.toString()
    });
    
    // 跳转到搜索结果页面
    window.location.href = `/search-results?${params.toString()}`;
  };

  const scrollToSearch = () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // 添加极光效果
      searchForm.classList.add('animate-aurora-glow', 'animate-aurora-wave', 'ring-2', 'ring-blue-400', 'ring-opacity-60');
      
      // 创建极光内层光晕效果
      const auroraEffect = document.createElement('div');
      auroraEffect.className = 'absolute inset-0 rounded-xl animate-aurora-shimmer pointer-events-none';
      auroraEffect.style.animationDuration = '2.5s';
      searchForm.style.position = 'relative';
      searchForm.appendChild(auroraEffect);
      
      // 创建极光外层光波效果
      const auroraWave = document.createElement('div');
      auroraWave.className = 'absolute inset-0 rounded-xl border border-cyan-400/40 animate-ping pointer-events-none';
      auroraWave.style.animationDuration = '3s';
      auroraWave.style.animationDelay = '0.3s';
      searchForm.appendChild(auroraWave);
      
      // 创建极光闪烁效果
      const auroraShimmer = document.createElement('div');
      auroraShimmer.className = 'absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 via-purple-500/15 to-cyan-400/10 animate-pulse pointer-events-none';
      auroraShimmer.style.animationDuration = '1.5s';
      searchForm.appendChild(auroraShimmer);
      
      // 5秒后移除所有极光效果
      setTimeout(() => {
        searchForm.classList.remove('animate-aurora-glow', 'animate-aurora-wave', 'ring-2', 'ring-blue-400', 'ring-opacity-60');
        if (auroraEffect.parentNode) {
          auroraEffect.parentNode.removeChild(auroraEffect);
        }
        if (auroraWave.parentNode) {
          auroraWave.parentNode.removeChild(auroraWave);
        }
        if (auroraShimmer.parentNode) {
          auroraShimmer.parentNode.removeChild(auroraShimmer);
        }
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_40%_at_70%_10%,#dbeafe_0%,transparent_60%),radial-gradient(50%_60%_at_10%_20%,#fef3c7_0%,transparent_60%),linear-gradient(180deg,#ffffff, #f8fafc)] text-gray-900">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b border-white/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-flex size-7 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 items-center justify-center overflow-hidden">
              <img 
                src="/bird-logo.svg" 
                alt="Hwigo Hostel Logo" 
                className="size-6 object-contain"
              />
            </span>
            Hwigo Hostel
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#rooms" className="hover:text-gray-900">房型</a>
            <a href="#events" className="hover:text-gray-900">活动</a>
            <a href="#why" className="hover:text-gray-900">选择我们</a>
            <a href="#contact" className="hover:text-gray-900">联系</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild>
              <a href="/login">登录</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
                <Leaf className="size-4"/>  简单 · 大气 · 通俗易懂
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
                住进城市的呼吸，<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">遇见世界的你</span>
              </h1>
              <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
                我们是一家为背包客、独行侠与小团队打造的青年旅馆。干净、友好、价格公道——一切都不复杂，只为让你的旅行轻松舒心。
              </p>

              {/* 预订栏 */}
              <Card id="search-form" className="mt-6 border-none shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="flex flex-col relative">
                      <label className="text-xs text-gray-500 mb-1">城市</label>
                      <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                          <MapPin className="size-4 text-gray-500"/>
                          <input 
                            ref={inputRef}
                            type="text" 
                            value={city} 
                            onChange={e=>handleCityInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => city.length > 0 && setShowSuggestions(true)}
                            placeholder="输入城市名称，如：马德里、巴塞罗那..."
                            className="w-full bg-transparent outline-none placeholder:text-gray-400"
                          />
                        </div>
                        
                        {/* 城市建议下拉列表 */}
                        {showSuggestions && filteredCities.length > 0 && (
                          <div 
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto"
                          >
                            {filteredCities.map((cityName, index) => (
                              <div
                                key={cityName}
                                onClick={() => selectCity(cityName)}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                  index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                } ${index === 0 ? 'rounded-t-xl' : ''} ${index === filteredCities.length - 1 ? 'rounded-b-xl' : ''}`}
                              >
                                <MapPin className="size-3 text-gray-400"/>
                                <span className="text-sm">{cityName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* 日期范围选择 */}
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">入住</label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                        <Calendar className="size-4 text-gray-500"/>
                        <input type="date" value={checkin} min={new Date().toISOString().split('T')[0]} onChange={e=>setCheckin(e.target.value)} className="w-full bg-transparent outline-none"/>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">退房</label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                        <Calendar className="size-4 text-gray-500"/>
                        <input type="date" value={checkout} min={checkin || new Date().toISOString().split('T')[0]} onChange={e=>setCheckout(e.target.value)} className="w-full bg-transparent outline-none"/>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">人数</label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                        <Users className="size-4 text-gray-500"/>
                        <input type="number" min={1} value={guests} onChange={e=>setGuests(Number(e.target.value))} className="w-full bg-transparent outline-none"/>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button onClick={onSearch} className="px-6">探索房源</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Shield className="size-4"/> 无隐形费用</div>
                <div className="flex items-center gap-1"><Lock className="size-4"/> 安全门禁</div>
                <div className="flex items-center gap-1"><Wifi className="size-4"/> 全屋高速 Wi‑Fi</div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6, delay:0.1}}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-teal-200 rounded-3xl blur-2xl opacity-70"/>
                
                <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
                  <img
                    src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1640&auto=format&fit=crop"
                    alt="明亮的公共空间"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">为什么选择我们</h2>
            <p className="text-sm text-gray-500">把预算花在真正重要的地方：体验与相遇</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Feature icon={Bed} title="床位舒适" desc="高密床垫与洁净床品，每晚睡个好觉。"/>
            <Feature icon={Wifi} title="高速网络" desc="覆盖每个角落，远程办公也轻松。"/>
            <Feature icon={Coffee} title="公共厨房" desc="自己动手更实惠，也更有家的味道。"/>
            <Feature icon={MapPin} title="地理位置好" desc="近地铁与核心景点，节省通勤时间。"/>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="py-14 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">房型与价格</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">查看全部房型 →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <RoomCard
              label="多人床位（混合/女生）"
              price={69}
              img="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1640&auto=format&fit=crop"
              bullets={["独立储物柜","阅读灯与充电口","隐私帘"]}
            />
            <RoomCard
              label="标准双人房"
              price={198}
              img="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1640&auto=format&fit=crop"
              bullets={["独立卫浴","可开窗采光","适合情侣/好友"]}
            />
            <RoomCard
              label="家庭房 / 小团体"
              price={288}
              img="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1640&auto=format&fit=crop"
              bullets={["可住 3–4 人","小型客厅区","带娃出行更从容"]}
            />
          </div>
        </div>
      </section>

      {/* Events / 社群 */}
      <section id="events" className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">轻松认识新朋友</h2>
            <p className="text-sm text-gray-500">每天都有小而美的活动</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-none bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-start gap-3">
                <MessageCircle className="size-6 mt-1"/>
                <div>
                  <h3 className="font-semibold">桌游夜 & 语言角</h3>
                  <p className="text-sm text-gray-600 mt-1">用桌游破冰，学几句当地话，和世界交朋友。</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-start gap-3">
                <Leaf className="size-6 mt-1"/>
                <div>
                  <h3 className="font-semibold">城市慢行</h3>
                  <p className="text-sm text-gray-600 mt-1">店长带路探索小巷与咖啡馆，看不一样的城市风景。</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-white/80 backdrop-blur">
              <CardContent className="p-6 flex items-start gap-3">
                <Coffee className="size-6 mt-1"/>
                <div>
                  <h3 className="font-semibold">手冲咖啡体验</h3>
                  <p className="text-sm text-gray-600 mt-1">住客免费体验一杯精品咖啡，醒神也温暖。</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">把复杂交给我们，把旅程留给风景</h2>
          <p className="mt-3 opacity-90">现在预订，解锁更好的相遇</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button className="px-6 text-blue-600 bg-white hover:bg-white/90" onClick={scrollToSearch}>
              开始预订
            </Button>
            <Button variant="secondary" className="px-6 bg-white/20 hover:bg-white/30 text-white" asChild>
              <a href="#rooms">查看房型</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-2">
              <span className="inline-flex size-7 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 items-center justify-center text-white">
                <Sparkles className="size-4" />
              </span>
              Hwigo Hostel
            </div>
            <p className="text-gray-600">一张床位，一个故事。你的城市驿站。</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">联系我们</h4>
            <ul className="space-y-1 text-gray-600">
              <li>电话：+34 91 123 4567</li>
              <li>邮箱：hi@youthhostel.es</li>
              <li>地址：马德里市中心区</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">快速链接</h4>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#rooms" className="hover:underline">房型与价格</a></li>
              <li><a href="#events" className="hover:underline">活动与社群</a></li>
              <li><a href="#why" className="hover:underline">入住须知</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">关注我们</h4>
            <p className="text-gray-600">Instagram / Facebook / Twitter：@青旅YH</p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 mt-6 text-xs text-gray-500">© {new Date().getFullYear()} Hwigo Hostel</div>
      </footer>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  BadgePercent,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BirdIcon } from "@/components/ui/bird-icon";

// —— 工具函数 ——
function parseYmd(s: string) {
  if (!s) return null;
  const t = s.replace(/\//g, "-");
  const [y, m, d] = t.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const ms = parseYmd(b)!.getTime() - parseYmd(a)!.getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

// 国家代码和电话号码格式验证
const countryData = [
  { code: "+86", name: "中国", flag: "🇨🇳", pattern: /^1[3-9]\d{9}$/ },
  { code: "+34", name: "西班牙", flag: "🇪🇸", pattern: /^[6-9]\d{8}$/ },
  { code: "+33", name: "法国", flag: "🇫🇷", pattern: /^[67]\d{8}$/ },
  { code: "+49", name: "德国", flag: "🇩🇪", pattern: /^1[5-7]\d{8,9}$/ },
  { code: "+39", name: "意大利", flag: "🇮🇹", pattern: /^3\d{8,9}$/ },
  { code: "+44", name: "英国", flag: "🇬🇧", pattern: /^7\d{9}$/ },
  { code: "+1", name: "美国/加拿大", flag: "🇺🇸", pattern: /^\d{10}$/ },
  { code: "+81", name: "日本", flag: "🇯🇵", pattern: /^[789]0\d{8}$/ },
  { code: "+82", name: "韩国", flag: "🇰🇷", pattern: /^1[0-9]\d{7,8}$/ },
  { code: "+65", name: "新加坡", flag: "🇸🇬", pattern: /^[89]\d{7}$/ },
  { code: "+852", name: "香港", flag: "🇭🇰", pattern: /^[5-9]\d{7}$/ },
  { code: "+886", name: "台湾", flag: "🇹🇼", pattern: /^9\d{8}$/ },
];

function validatePhoneNumber(phone: string, countryCode: string): string {
  if (!phone.trim()) return "请输入手机号码";
  
  const country = countryData.find(c => c.code === countryCode);
  if (!country) return "不支持的国家代码";
  
  if (!country.pattern.test(phone)) {
    return `${country.name}手机号码格式不正确`;
  }
  
  return "";
}

// —— 页面组件 ——
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  
  // 从URL参数获取预订信息
  const hotelId = searchParams.get('hotelId') || 'madrid-1';
  const hotelName = searchParams.get('hotelName') || '青旅·马德里中心店';
  const city = searchParams.get('city') || 'Madrid';
  const checkIn = searchParams.get('checkIn') || '2025-09-12';
  const checkOut = searchParams.get('checkOut') || '2025-09-14';
  const roomName = searchParams.get('roomName') || '标准双人房';
  const guests = Number(searchParams.get('guests') || 2);
  const nightly = Number(searchParams.get('nightly') || 86); // 每晚基价

  const nights = nightsBetween(checkIn, checkOut);
  const base = nightly * nights;

  // 费用与折扣
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const discount = coupon.toUpperCase() === "YOUTH10" ? 0.1 * base : 0;
  const tax = 0.1 * (base - discount);
  const service = Math.max(4, 0.03 * base);
  const total = Math.max(0, Math.round((base - discount + tax + service) * 100) / 100);

  // 旅客/联系方式
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+86");
  const [phoneError, setPhoneError] = useState("");

  // 支付表单
  const [cardNo, setCardNo] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canPay = useMemo(() => {
    const phoneValidation = validatePhoneNumber(phone, countryCode);
    return (
      fullName.trim().length > 1 &&
      /.+@.+\..+/.test(email) &&
      phone.trim().length > 0 &&
      phoneValidation === "" &&
      cardNo.replace(/\s/g, "").length >= 12 &&
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) &&
      /\d{3,4}/.test(cvc) &&
      agree &&
      nights > 0
    );
  }, [fullName, email, phone, countryCode, cardNo, exp, cvc, agree, nights]);

  function applyCoupon() {
    if (coupon.toUpperCase() === "YOUTH10") {
      setCouponMsg("已使用 9 折优惠券");
    } else if (coupon.trim()) {
      setCouponMsg("未找到该优惠码");
    } else {
      setCouponMsg("");
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    const error = validatePhoneNumber(value, countryCode);
    setPhoneError(error);
  }

  function handleCountryCodeChange(value: string) {
    setCountryCode(value);
    const error = validatePhoneNumber(phone, value);
    setPhoneError(error);
  }

  async function onPay() {
    setErr("");
    
    // 验证电话号码
    const phoneValidation = validatePhoneNumber(phone, countryCode);
    if (phoneValidation) {
      setErr(`电话号码验证失败：${phoneValidation}`);
      return;
    }
    
    if (!canPay) {
      setErr("请完整填写信息并同意条款");
      return;
    }
    setLoading(true);
    try {
      // 这里对接 Stripe / 支付网关
      await new Promise((r) => setTimeout(r, 1200));
      
      // 构建订单结果页面URL参数
      const params = new URLSearchParams({
        hotelId: hotelId,
        hotelName: hotelName,
        city: city,
        checkIn: checkIn,
        checkOut: checkOut,
        roomName: roomName,
        guests: guests.toString(),
        total: total.toString(),
        customerName: fullName,
        customerEmail: email,
        customerPhone: `${countryCode} ${phone}`
      });
      
      // 跳转到订单结果页面
      window.location.href = `/order-success?${params.toString()}`;
    } catch (e) {
      setErr("支付失败，请稍后再试");
    } finally {
      setLoading(false);
    }
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
          <div className="text-sm text-gray-600">安全结算 <ShieldCheck className="inline size-4"/></div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
        {/* 左：表单 */}
        <section className="space-y-4">
          <Card className="border border-gray-100">
            <CardContent className="p-4">
              <h2 className="font-semibold">入住信息</h2>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <label className="text-sm">姓名
                  <input 
                    value={fullName} 
                    onChange={(e)=>setFullName(e.target.value)} 
                    placeholder="与证件一致" 
                    className="mt-1 w-full px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
                <label className="text-sm">邮箱
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                    placeholder="用于接收预订确认" 
                    className="mt-1 w-full px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
                <label className="text-sm">手机号
                  <div className="mt-1 flex gap-2">
                    <select 
                      value={countryCode} 
                      onChange={(e)=>handleCountryCodeChange(e.target.value)}
                      className="px-2 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-[90px] text-sm"
                    >
                      {countryData.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input 
                      value={phone} 
                      onChange={(e)=>handlePhoneChange(e.target.value)} 
                      placeholder="输入手机号码" 
                      className="flex-1 px-2 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-[200px]"
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-600">{phoneError}</p>
                  )}
                </label>
                <label className="text-sm">优惠码（可选）
                  <div className="mt-1 flex gap-2">
                    <input 
                      value={coupon} 
                      onChange={(e)=>setCoupon(e.target.value)} 
                      placeholder="例如：YOUTH10" 
                      className="flex-1 px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button type="button" variant="secondary" onClick={applyCoupon} className="flex items-center gap-1">
                      <BadgePercent className="size-4"/> 使用
                    </Button>
                  </div>
                  {couponMsg && (
                    <p className={`mt-1 text-xs ${couponMsg.includes('未')? 'text-red-600':'text-green-600'}`}>
                      {couponMsg}
                    </p>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-4">
              <h2 className="font-semibold">支付方式</h2>
              <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                <label className="md:col-span-2">卡号
                  <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
                    <CreditCard className="size-4 text-gray-500"/>
                    <input 
                      value={cardNo} 
                      onChange={(e)=>setCardNo(e.target.value)} 
                      placeholder="1234 5678 9012 3456" 
                      className="w-full bg-transparent outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </label>
                <label>有效期
                  <input 
                    value={exp} 
                    onChange={(e)=>setExp(e.target.value)} 
                    placeholder="MM/YY" 
                    className="mt-1 w-full px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
                <label>安全码
                  <input 
                    value={cvc} 
                    onChange={(e)=>setCvc(e.target.value)} 
                    placeholder="CVC" 
                    className="mt-1 w-full px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </label>
              </div>

              <label className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                <input 
                  type="checkbox" 
                  checked={agree} 
                  onChange={(e)=>setAgree(e.target.checked)} 
                  className="mt-0.5"
                />
                我已阅读并同意 <a href="/terms" className="text-blue-600 mx-1 hover:underline">预订条款</a> 与 <a href="/policy" className="text-blue-600 mx-1 hover:underline">取消政策</a>（到店前 48 小时内取消，收取首晚费用）
              </label>

              {err && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="size-4"/> {err}
                </p>
              )}

              <Button className="mt-4 w-full" disabled={!canPay || loading} onClick={onPay}>
                {loading ? "正在支付…" : `支付 €${total}`}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 右：订单摘要 */}
        <aside>
          <Card className="border border-gray-100 sticky top-24">
            <CardContent className="p-4 space-y-3">
              <h2 className="font-semibold">订单摘要</h2>
              <div className="text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">旅店</span>
                  <span>{hotelName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">城市</span>
                  <span>{city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">房型</span>
                  <span>{roomName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">人数</span>
                  <span><Users className="inline size-4"/> {guests} 人</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">入住</span>
                  <span><Calendar className="inline size-4"/> {checkIn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">退房</span>
                  <span><Calendar className="inline size-4"/> {checkOut}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">共计晚数</span>
                  <span>{nights} 晚</span>
                </div>
              </div>

              <div className="pt-3 border-t text-sm text-gray-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span>房费（€{nightly} × {nights}晚）</span>
                  <span>€{(Math.round(base*100)/100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>优惠</span>
                  <span className={discount?"text-green-600":"text-gray-500"}>
                    {discount?`-€${discount.toFixed(2)}`:"—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>税费（10%）</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>服务费</span>
                  <span>€{service.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-extrabold text-lg pt-1">
                  <span>应付总额</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                * 你的信息仅用于预订与入住沟通，我们遵守隐私政策与 GDPR 要求。
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>

      <footer className="py-10 bg-white">
        <div className="mx-auto max-w-6xl px-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Hwigo Hostel
        </div>
      </footer>
    </div>
  );
}

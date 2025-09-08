"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Download,
  Mail,
  Phone,
  Clock,
  Star,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BirdIcon } from "@/components/ui/bird-icon";

// —— 工具函数 ——
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `YH${timestamp}${random}`;
}

// —— 页面组件 ——
export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  
  // 从URL参数获取订单信息
  const hotelId = searchParams.get('hotelId') || 'madrid-1';
  const hotelName = searchParams.get('hotelName') || '青旅·马德里中心店';
  const city = searchParams.get('city') || 'Madrid';
  const checkIn = searchParams.get('checkIn') || '2025-09-12';
  const checkOut = searchParams.get('checkOut') || '2025-09-14';
  const roomName = searchParams.get('roomName') || '标准双人房';
  const guests = Number(searchParams.get('guests') || 2);
  const total = Number(searchParams.get('total') || 198);
  const customerName = searchParams.get('customerName') || '张先生';
  const customerEmail = searchParams.get('customerEmail') || 'zhang@example.com';
  const customerPhone = searchParams.get('customerPhone') || '+86 13812345678';

  const [orderNumber] = useState(generateOrderNumber());
  const [checkInTime] = useState('15:00');
  const [checkOutTime] = useState('11:00');

  // 计算入住天数
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  function downloadReceipt() {
    // 模拟下载收据
    alert('收据下载功能将在后续版本中实现');
  }

  function sendToEmail() {
    // 模拟发送到邮箱
    alert(`预订确认已发送到 ${customerEmail}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
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
          <Button variant="outline" asChild>
            <a href="/">返回首页</a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 成功提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">预订成功！</h1>
          <p className="text-gray-600">您的预订已确认，我们期待您的到来</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            订单号：{orderNumber}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左侧：预订详情 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* 酒店信息 */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  预订详情
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">酒店</span>
                    <span className="font-medium">{hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">城市</span>
                    <span className="font-medium">{city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">房型</span>
                    <span className="font-medium">{roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">入住人数</span>
                    <span className="font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {guests} 人
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">入住日期</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(checkIn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">退房日期</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(checkOut)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">入住天数</span>
                    <span className="font-medium">{nights} 晚</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">入住时间</span>
                    <span className="font-medium">{checkInTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">退房时间</span>
                    <span className="font-medium">{checkOutTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息 */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  联系信息
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">预订人</span>
                    <span className="font-medium">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">邮箱</span>
                    <span className="font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {customerEmail}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧：支付信息和操作 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* 支付信息 */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  支付信息
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付状态</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      已支付
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付金额</span>
                    <span className="font-bold text-lg">€{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付时间</span>
                    <span className="font-medium">{new Date().toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付方式</span>
                    <span className="font-medium">信用卡</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">后续操作</h2>
                <div className="space-y-3">
                  <Button className="w-full" onClick={downloadReceipt}>
                    <Download className="w-4 h-4 mr-2" />
                    下载收据
                  </Button>
                  <Button variant="outline" className="w-full" onClick={sendToEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    发送到邮箱
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/search-results">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      继续预订
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 重要提醒 */}
            <Card className="border border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  重要提醒
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• 请携带有效身份证件办理入住</li>
                  <li>• 入住时间为 {checkInTime}，退房时间为 {checkOutTime}</li>
                  <li>• 如需取消或修改预订，请提前48小时联系</li>
                  <li>• 预订确认邮件已发送到您的邮箱</li>
                  <li>• 如有疑问，请联系客服：+34 123 456 789</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </main>

      {/* 底部 */}
      <footer className="py-10 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Hwigo Hostel | 感谢您的预订，祝您旅途愉快！
        </div>
      </footer>
    </div>
  );
}

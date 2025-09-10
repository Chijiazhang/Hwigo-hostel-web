"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BirdIcon } from "../../components/ui/bird-icon";
import { useFavorites, UserInfo } from "../../contexts/FavoriteContext";

// 强制动态渲染
export const dynamic = 'force-dynamic';

// 密码验证工具
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strengthLabels = ["弱", "一般", "良好", "强"] as const;

// 密码要求检查
function checkPasswordRequirements(pw: string) {
  const requirements = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };
  
  return {
    ...requirements,
    allMet: Object.values(requirements).every(Boolean)
  };
}

function calcPasswordScore(pw: string) {
  const reqs = checkPasswordRequirements(pw);
  let score = 0;
  if (reqs.length) score++;
  if (reqs.uppercase) score++;
  if (reqs.lowercase) score++;
  if (reqs.number) score++;
  if (reqs.special) score++;
  // 0-5 → 映射 0-3
  return Math.min(3, Math.max(0, Math.floor((score - 1) / 1.5)));
}

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [agree, setAgree] = useState(false);
  
  const { setLoggedIn } = useFavorites();

  // UI 状态
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // 验证码倒计时
  const [leftSec, setLeftSec] = useState(0);
  useEffect(() => {
    if (leftSec <= 0) return;
    const t = setInterval(() => setLeftSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [leftSec]);

  const pwScore = useMemo(() => calcPasswordScore(password), [password]);

  // 实时检测两次密码是否一致（用于红色提醒）
  const pwMismatch = Boolean(confirmPassword) && confirmPassword !== password;

  function validateOnSubmit() {
    const next: Record<string, string> = {};
    if (!nickname.trim()) next.nickname = "请填写昵称";
    if (!emailRe.test(email)) next.email = "邮箱格式不正确";
    
    // 严格的密码验证
    const passwordReqs = checkPasswordRequirements(password);
    if (!passwordReqs.allMet) {
      next.password = "密码必须满足所有要求：至少8位，包含大小写字母、数字和特殊字符";
    }
    
    if (confirmPassword !== password) next.confirmPassword = "两次输入的密码不一致";
    if (!captcha.trim()) next.captcha = "请输入验证码";
    if (!agree) next.agree = "请勾选同意服务条款";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const formValid =
    nickname.trim() &&
    emailRe.test(email) &&
    checkPasswordRequirements(password).allMet &&
    confirmPassword === password &&
    captcha.trim() &&
    agree;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOnSubmit()) return;
    
    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nickname, 
          email, 
          password, 
          captcha 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(result.message);
        
        // 注册成功后自动登录
        const userInfo: UserInfo = {
          id: result.user.id,
          nickname: result.user.nickname,
          email: result.user.email,
          avatar: `https://i.pravatar.cc/32?img=${Math.floor(Math.random() * 70)}`
        };
        
        setLoggedIn(true, userInfo);
        
        // 清空表单
        setNickname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCaptcha("");
        setAgree(false);
        
        // 3秒后跳转到首页
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('注册失败:', error);
      setErrors({ submit: '网络错误，请检查网络连接后重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    // 这里接入 Google OAuth（如 NextAuth、Firebase Auth 或自建 OAuth）
    alert("使用 Google 账户注册（此处接入 OAuth）");
  };

  const onSendCaptcha = async () => {
    if (!emailRe.test(email)) {
      setErrors((e) => ({ ...e, email: "请先填写有效邮箱" }));
      return;
    }

    try {
      setSendingCode(true);
      setErrors((e) => ({ ...e, captcha: "" }));

      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setLeftSec(60);
        setSuccessMessage(result.message);
        // 清除之前的错误信息
        setErrors((e) => ({ ...e, captcha: "" }));
      } else {
        setErrors((e) => ({ ...e, captcha: result.message }));
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setErrors((e) => ({ ...e, captcha: '网络错误，请稍后重试' }));
    } finally {
      setSendingCode(false);
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

      {/* 注册表单 */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-none bg-white/80 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">创建新账户</CardTitle>
              <p className="text-center text-sm text-gray-600 mt-1">注册你的青旅账户</p>
            </CardHeader>
            <CardContent>
              {/* 成功消息 */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="size-4"/>
                    {successMessage}
                  </p>
                </div>
              )}

              {/* 错误消息 */}
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="size-4"/>
                    {errors.submit}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 昵称 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">昵称</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white ${errors.nickname ? 'border-red-300' : ''}`}>
                    <User className="size-4 text-gray-500" />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="输入昵称"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  {errors.nickname && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> {errors.nickname}</p>
                  )}
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">邮箱</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white ${errors.email ? 'border-red-300' : ''}`}>
                    <Mail className="size-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="输入邮箱"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  {errors.email ? (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> {errors.email}</p>
                  ) : email && emailRe.test(email) ? (
                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="size-3"/> 邮箱格式看起来没问题</p>
                  ) : null}
                </div>

                {/* 密码 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">密码</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white ${errors.password ? 'border-red-300' : ''}`}>
                    <Lock className="size-4 text-gray-500" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入密码（必须满足所有要求）"
                      className="w-full bg-transparent outline-none"
                    />
                    <button type="button" onClick={() => setShowPw((s)=>!s)} className="opacity-60 hover:opacity-100">
                      {showPw ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                    </button>
                  </div>
                  
                  {/* 密码要求提示 */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 font-medium">⚠️ 密码必须包含（全部满足才能注册）：</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        {password.length >= 8 ? <CheckCircle2 className="size-3"/> : <AlertCircle className="size-3"/>}
                        至少 8 位字符
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[A-Z]/.test(password) ? <CheckCircle2 className="size-3"/> : <AlertCircle className="size-3"/>}
                        大写字母 (A-Z)
                      </div>
                      <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[a-z]/.test(password) ? <CheckCircle2 className="size-3"/> : <AlertCircle className="size-3"/>}
                        小写字母 (a-z)
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[0-9]/.test(password) ? <CheckCircle2 className="size-3"/> : <AlertCircle className="size-3"/>}
                        数字 (0-9)
                      </div>
                      <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[^A-Za-z0-9]/.test(password) ? <CheckCircle2 className="size-3"/> : <AlertCircle className="size-3"/>}
                        特殊字符 (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 h-1 rounded bg-gray-100 overflow-hidden">
                    <div
                      className={`h-1 ${pwScore===0?'bg-red-400':pwScore===1?'bg-yellow-400':pwScore===2?'bg-green-400':'bg-green-600'}`}
                      style={{ width: `${(pwScore + 1) * 25}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">密码强度：{strengthLabels[pwScore]}</p>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> {errors.password}</p>
                  )}
                </div>

                {/* 确认密码 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">确认密码</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white ${pwMismatch || errors.confirmPassword ? 'border-red-400 ring-1 ring-red-200' : ''}`}>
                    <Lock className="size-4 text-gray-500" />
                    <input
                      type={showPw2 ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => {
                        // 失焦时如不一致，放入 errors 里，形成可提交前的强提醒
                        if (confirmPassword && confirmPassword !== password) {
                          setErrors((prev) => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
                        } else {
                          setErrors((prev) => { const { confirmPassword, ...rest } = prev; return rest; });
                        }
                      }}
                      placeholder="再次输入密码"
                      className="w-full bg-transparent outline-none"
                    />
                    <button type="button" onClick={() => setShowPw2((s)=>!s)} className="opacity-60 hover:opacity-100">
                      {showPw2 ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                    </button>
                  </div>
                  {(pwMismatch || errors.confirmPassword) && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> 两次输入的密码不一致</p>
                  )}
                </div>

                {/* 验证码 */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">验证码</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border bg-white ${errors.captcha ? 'border-red-300' : ''}`}>
                    <KeyRound className="size-4 text-gray-500" />
                    <input
                      type="text"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="输入邮箱收到的 4 位验证码"
                      className="w-full bg-transparent outline-none"
                      maxLength={4}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-xs"
                      onClick={onSendCaptcha}
                      disabled={leftSec>0 || sendingCode}
                    >
                      {sendingCode ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="size-3 animate-spin"/>
                          发送中
                        </span>
                      ) : leftSec>0 ? (
                        `${leftSec}s 后重发`
                      ) : (
                        '获取验证码'
                      )}
                    </Button>
                  </div>
                  {errors.captcha && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> {errors.captcha}</p>
                  )}
                </div>

                {/* 协议 */}
                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="mt-0.5"/>
                  我已阅读并同意 <a href="/terms" className="text-blue-600 mx-1 hover:underline">服务条款</a> 与 <a href="/privacy" className="text-blue-600 mx-1 hover:underline">隐私政策</a>
                </label>
                {errors.agree && (
                  <p className="-mt-2 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> {errors.agree}</p>
                )}

                {/* 提交 & 第三方 */}
                <Button type="submit" className="w-full" disabled={!formValid || loading}>
                  {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin"/> 注册中…</span> : '注册'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleRegister}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="size-4"
                  />
                  使用 Google 账户注册
                </Button>

                <p className="text-center text-sm text-gray-500">
                  已有账号？ <a href="/login" className="text-blue-600 hover:underline">立即登录</a>
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

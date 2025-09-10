'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, Heart, LogOut } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoriteContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, user, logout } = useFavorites()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    // 跳转到首页
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">青年旅馆</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/hostels" className="text-gray-700 hover:text-blue-600 transition-colors">
              所有旅馆
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              关于我们
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              联系我们
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            
            {/* 根据登录状态显示不同内容 */}
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                {/* 用户头像和昵称 */}
                <Link href="/account" className="flex items-center space-x-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                  <img 
                    src={user.avatar || "https://i.pravatar.cc/32?img=13"} 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-blue-600 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user.nickname}
                  </span>
                </Link>
                {/* 登出按钮 */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <a href="/login" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
                <User className="w-4 h-4 mr-2" />
                登录
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/hostels" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                所有旅馆
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                关于我们
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                联系我们
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    {/* 用户信息 */}
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <img 
                        src={user.avatar || "https://i.pravatar.cc/24?img=13"} 
                        alt="用户头像" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">{user.nickname}</span>
                    </div>
                    
                    {/* 个人账户链接 */}
                    <Link 
                      href="/account" 
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>个人账户</span>
                    </Link>
                    
                    {/* 登出按钮 */}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>登出</span>
                    </button>
                  </>
                ) : (
                  <a href="/login" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors w-full">
                    <User className="w-4 h-4 mr-2" />
                    登录
                  </a>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


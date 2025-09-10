'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, Heart, LogOut } from 'lucide-react'
import { useFavorites } from '../contexts/FavoriteContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, user, logout, favorites } = useFavorites()

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
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              首页
            </Link>
            <Link href="/hostels" className="text-gray-700 hover:text-primary-600 transition-colors">
              所有旅馆
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              关于我们
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              联系我们
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {user?.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.nickname} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{user?.nickname}</span>
                </div>
                <Link href="/account" className="btn-primary">
                  <User className="w-4 h-4 mr-2" />
                  账户
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <a href="/login" className="btn-primary">
                <User className="w-4 h-4 mr-2" />
                登录
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
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
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/hostels" 
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                所有旅馆
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                关于我们
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                联系我们
              </Link>
              <div className="pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2">
                      {user?.avatar && (
                        <img 
                          src={user.avatar} 
                          alt={user.nickname} 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-700">{user?.nickname}</span>
                    </div>
                    <Link 
                      href="/account" 
                      className="btn-primary w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      账户
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline" />
                      登出
                    </button>
                  </div>
                ) : (
                  <a href="/login" className="btn-primary w-full">
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


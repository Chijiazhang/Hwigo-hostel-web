"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 用户信息类型
export interface UserInfo {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

// 收藏项类型
export interface FavoriteItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  cover: string;
}

// Context 类型
interface FavoriteContextType {
  // 用户状态
  isLoggedIn: boolean;
  user: UserInfo | null;
  setLoggedIn: (loggedIn: boolean, userInfo?: UserInfo) => void;
  logout: () => void;
  
  // 收藏功能
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

// 创建 Context
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Provider 组件
export function FavoriteProvider({ children }: { children: ReactNode }) {
  // 用户状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  
  // 收藏状态
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // 从 localStorage 恢复状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLoginState = localStorage.getItem('isLoggedIn');
      const savedUser = localStorage.getItem('user');
      const savedFavorites = localStorage.getItem('favorites');

      if (savedLoginState === 'true' && savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // 保存状态到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', isLoggedIn.toString());
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // 设置登录状态
  const setLoggedIn = (loggedIn: boolean, userInfo?: UserInfo) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && userInfo) {
      setUser(userInfo);
    } else {
      setUser(null);
    }
  };

  // 登出
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  };

  // 添加到收藏
  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  // 从收藏中移除
  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  // 检查是否已收藏
  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const value: FavoriteContextType = {
    isLoggedIn,
    user,
    setLoggedIn,
    logout,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

// Hook 来使用 Context
export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}

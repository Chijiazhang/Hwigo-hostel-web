'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

export default function Hero() {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以添加搜索逻辑
    console.log('搜索:', searchData)
  }

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            探索世界，结交朋友
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            发现我们精心挑选的青年旅馆，享受独特的旅行体验，结识来自世界各地的旅行者
          </p>
          
          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="目的地"
                    className="input-field pl-10"
                    value={searchData.location}
                    onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                  />
                </div>
                
                {/* Check-in */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    className="input-field pl-10"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  />
                </div>
                
                {/* Check-out */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    className="input-field pl-10"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  />
                </div>
                
                {/* Guests */}
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="input-field pl-10"
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} 人</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button type="submit" className="btn-primary w-full md:w-auto px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2 inline" />
                  搜索旅馆
                </button>
              </div>
            </form>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">精选旅馆</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">满意客人</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100">推荐率</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

















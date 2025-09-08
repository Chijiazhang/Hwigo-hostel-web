'use client'

import { useState } from 'react'
import { Search, Filter, MapPin } from 'lucide-react'
import { SearchParams } from '@/types/hostel'

interface SearchSectionProps {
  onSearch: (params: SearchParams) => void
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    type: 'all',
    maxPrice: undefined
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = () => {
    onSearch(searchParams)
  }

  const hostelTypes = [
    { value: 'all', label: '所有类型' },
    { value: '城市', label: '城市' },
    { value: '山区', label: '山区' },
    { value: '海滨', label: '海滨' },
    { value: '文化', label: '文化' },
    { value: '森林', label: '森林' },
    { value: '沙漠', label: '沙漠' }
  ]

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Basic Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索目的地..."
                className="input-field pl-10 w-full lg:w-80"
                value={searchParams.location}
                onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="w-full lg:w-auto">
            <select
              className="input-field w-full lg:w-40"
              value={searchParams.type}
              onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
            >
              {hostelTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="w-full lg:w-auto">
            <select
              className="input-field w-full lg:w-40"
              value={searchParams.maxPrice || ''}
              onChange={(e) => setSearchParams({
                ...searchParams, 
                maxPrice: e.target.value ? parseInt(e.target.value) : undefined
              })}
            >
              <option value="">不限价格</option>
              <option value="50">50元以下</option>
              <option value="100">100元以下</option>
              <option value="150">150元以下</option>
              <option value="200">200元以下</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="btn-primary w-full lg:w-auto px-8"
          >
            <Search className="w-5 h-5 mr-2 inline" />
            搜索
          </button>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-secondary w-full lg:w-auto"
          >
            <Filter className="w-4 h-4 mr-2 inline" />
            高级筛选
          </button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  设施
                </label>
                <div className="space-y-2">
                  {['免费WiFi', '公共厨房', '洗衣房', '24小时前台'].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评分
                </label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">{rating}+ 星</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  特色标签
                </label>
                <div className="space-y-2">
                  {['市中心', '交通便利', '自然风光', '文化体验'].map(tag => (
                    <label key={tag} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

















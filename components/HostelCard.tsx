'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, MapPin, Heart, Users, Wifi, Coffee, Car } from 'lucide-react'
import { Hostel } from '@/types/hostel'

interface HostelCardProps {
  hostel: Hostel
}

export default function HostelCard({ hostel }: HostelCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('WiFi')) return <Wifi className="w-4 h-4" />
    if (amenity.includes('厨房')) return <Coffee className="w-4 h-4" />
    if (amenity.includes('洗衣')) return <Car className="w-4 h-4" />
    return <Users className="w-4 h-4" />
  }

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={hostel.image}
          alt={hostel.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {hostel.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {hostel.name}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm">{hostel.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hostel.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {hostel.rating} ({hostel.reviewCount} 条评价)
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hostel.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-1">
              +{hostel.amenities.length - 3} 更多
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {hostel.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary-600">¥{hostel.price}</span>
            <span className="text-sm text-gray-500 ml-1">/晚</span>
          </div>
          <button className="btn-primary">
            立即预订
          </button>
        </div>
      </div>
    </div>
  )
}

















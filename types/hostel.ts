export interface Hostel {
  id: number
  name: string
  location: string
  price: number
  rating: number
  reviewCount: number
  image: string
  amenities: string[]
  description: string
  type: string
  tags: string[]
}

export interface SearchParams {
  location?: string
  type?: string
  maxPrice?: number
  checkIn?: string
  checkOut?: string
  guests?: number
}

export interface Booking {
  id: string
  hostelId: number
  hostelName: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

















export interface ClientCase {
  id: number
  nameEn: string
  nameZh: string
  logoUrl?: string
  imageUrl?: string
  countryEn: string
  countryZh: string
  industryEn?: string
  industryZh?: string
  descriptionEn?: string
  descriptionZh?: string
  year?: number
  isActive: boolean
  order: number
}

export interface ShipmentPhoto {
  id: number
  titleEn: string
  titleZh: string
  imageUrl: string
  date?: Date
  isActive: boolean
}

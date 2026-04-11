export interface Certificate {
  id: number
  nameEn: string
  nameZh: string
  imageUrl: string
  pdfUrl?: string
  descriptionEn?: string
  descriptionZh?: string
  issuedDate?: Date
  expiryDate?: Date
  order: number
  isActive: boolean
}

export interface GuaranteeSection {
  id: string
  icon: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  items: GuaranteeItem[]
}

export interface GuaranteeItem {
  id: string
  icon?: string
  titleEn: string
  titleZh: string
  descriptionEn?: string
  descriptionZh?: string
  isHighlight?: boolean
}

export interface ComparisonItem {
  categoryEn: string
  categoryZh: string
  normalSupplierEn: string
  normalSupplierZh: string
  zzScaleEn: string
  zzScaleZh: string
}

export interface TrustBadge {
  id: string
  icon: string
  valueEn: string
  valueZh: string
  labelEn: string
  labelZh: string
}

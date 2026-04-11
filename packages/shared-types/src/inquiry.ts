export type InquiryStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED' | 'SPAM';

export interface InquiryItem {
  id: number;
  inquiryId: number;
  productId?: number;
  productNameEn?: string;
  productNameZh?: string;
  quantity?: number;
  unitPrice?: number;
  notes?: string;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  message: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  status: InquiryStatus;
  assignedToId?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: InquiryItem[];
}

export interface CreateInquiryRequest {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  message: string;
  productIds?: number[];
}

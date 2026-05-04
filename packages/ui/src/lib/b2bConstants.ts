// B2B Trade Platform Constants
//集中管理所有可配置的业务常量，便于后续维护和扩展

// ==================== 认证标准 ====================
export const CERTIFICATIONS = [
  { code: 'CE', name: 'CE', fullName: 'Conformité Européenne', region: 'Europe', description: '欧盟安全认证' },
  { code: 'FCC', name: 'FCC', fullName: 'Federal Communications Commission', region: 'USA', description: '美国联邦通信委员会认证' },
  { code: 'RoHS', name: 'RoHS', fullName: 'Restriction of Hazardous Substances', region: 'Europe', description: '欧盟有害物质限制认证' },
  { code: 'ISO9001', name: 'ISO9001', fullName: 'ISO 9001 Quality Management', region: 'International', description: '国际质量管理体系认证' },
  { code: 'OIML', name: 'OIML', fullName: 'International Organization of Legal Metrology', region: 'International', description: '国际法制计量组织认证' },
  { code: 'UL', name: 'UL', fullName: 'Underwriters Laboratories', region: 'USA', description: '美国安全认证' },
  { code: 'FDA', name: 'FDA', fullName: 'Food and Drug Administration', region: 'USA', description: '美国食品和药物管理局认证' },
  { code: 'REACH', name: 'REACH', fullName: 'Registration, Evaluation, Authorisation and Restriction of Chemicals', region: 'Europe', description: '欧盟化学品注册评估授权法规' },
] as const;

export type CertificationCode = typeof CERTIFICATIONS[number]['code'];

// ==================== 港口 ====================
export const FOB_PORTS = [
  { code: 'SHA', name: 'Shanghai', nameZh: '上海', country: 'China' },
  { code: 'NGB', name: 'Ningbo', nameZh: '宁波', country: 'China' },
  { code: 'SZX', name: 'Shenzhen', nameZh: '深圳', country: 'China' },
  { code: 'CAN', name: 'Guangzhou', nameZh: '广州', country: 'China' },
  { code: 'TAO', name: 'Qingdao', nameZh: '青岛', country: 'China' },
  { code: 'TSN', name: 'Tianjin', nameZh: '天津', country: 'China' },
  { code: 'DLC', name: 'Dalian', nameZh: '大连', country: 'China' },
  { code: 'XMN', name: 'Xiamen', nameZh: '厦门', country: 'China' },
  { code: 'HKG', name: 'Hong Kong', nameZh: '香港', country: 'China' },
  { code: 'OTHER', name: 'Other', nameZh: '其他', country: '' },
] as const;

// ==================== 付款条款 ====================
export const PAYMENT_TERMS = [
  { code: 'TT30_70', name: 'T/T 30/70', nameZh: 'T/T 30%定金', description: '预付30%定金，发货前付清70%尾款' },
  { code: 'TT50_50', name: 'T/T 50/50', nameZh: 'T/T 50/50', description: '预付50%定金，发货前付清50%尾款' },
  { code: 'TT100', name: 'T/T 100%', nameZh: 'T/T 全款预付', description: '全额预付款' },
  { code: 'LC', name: 'L/C', nameZh: '信用证', description: '不可撤销信用证' },
  { code: 'LC_SIGHT', name: 'L/C at sight', nameZh: '即期信用证', description: '见票即付信用证' },
  { code: 'PayPal', name: 'PayPal', nameZh: 'PayPal', description: '贝宝在线支付' },
  { code: 'WU', name: 'Western Union', nameZh: '西联汇款', description: '西联汇款' },
  { code: 'TradeAssurance', name: 'Trade Assurance', nameZh: '贸易保障', description: 'Alibaba贸易保障' },
] as const;

// ==================== 运输条款 ====================
export const SHIPPING_TERMS = [
  { code: 'FOB', name: 'FOB', portRequired: true, description: '离岸价格，含国内运费' },
  { code: 'CIF', name: 'CIF', portRequired: true, description: '成本+保险+运费' },
  { code: 'EXW', name: 'EXW', portRequired: false, description: '工厂交货价' },
  { code: 'DDP', name: 'DDP', portRequired: false, description: '完税交货价' },
  { code: 'CFR', name: 'CFR', portRequired: true, description: '成本+运费' },
] as const;

// ==================== 保修期 ====================
export const WARRANTY_OPTIONS = [
  { code: '1Y', name: '1 Year', nameZh: '1年', months: 12 },
  { code: '2Y', name: '2 Years', nameZh: '2年', months: 24 },
  { code: '3Y', name: '3 Years', nameZh: '3年', months: 36 },
  { code: 'LIFETIME', name: 'Limited Lifetime', nameZh: '有限终身', months: null },
] as const;

// ==================== 交期 ====================
export const LEAD_TIMES = [
  { code: '3_5', name: '3-5 days', nameZh: '3-5天', min: 3, max: 5 },
  { code: '7_10', name: '7-10 days', nameZh: '7-10天', min: 7, max: 10 },
  { code: '15_20', name: '15-20 days', nameZh: '15-20天', min: 15, max: 20 },
  { code: '20_30', name: '20-30 days', nameZh: '20-30天', min: 20, max: 30 },
  { code: '30_45', name: '30-45 days', nameZh: '30-45天', min: 30, max: 45 },
  { code: '45_60', name: '45-60 days', nameZh: '45-60天', min: 45, max: 60 },
] as const;

// ==================== 出口经验 ====================
export const EXPORT_EXPERIENCE = [
  { code: '0_1', name: '0-1 years', nameZh: '0-1年', min: 0, max: 1 },
  { code: '1_3', name: '1-3 years', nameZh: '1-3年', min: 1, max: 3 },
  { code: '3_5', name: '3-5 years', nameZh: '3-5年', min: 3, max: 5 },
  { code: '5_10', name: '5-10 years', nameZh: '5-10年', min: 5, max: 10 },
  { code: '10_PLUS', name: '10+ years', nameZh: '10年以上', min: 10, max: null },
] as const;

// ==================== 产能单位 ====================
export const CAPACITY_UNITS = [
  { code: 'PCS_MONTH', name: 'pcs/month', nameZh: '台/月' },
  { code: 'PCS_YEAR', name: 'pcs/year', nameZh: '台/年' },
  { code: 'UNITS_MONTH', name: 'units/month', nameZh: '套/月' },
  { code: 'TONS_MONTH', name: 'tons/month', nameZh: '吨/月' },
  { code: 'CONTAINERS_MONTH', name: 'containers/month', nameZh: '柜/月' },
] as const;

// ==================== 目标市场/出口国家 ====================
export const TARGET_MARKETS = [
  { code: 'EU', name: 'Europe', nameZh: '欧洲', flag: '🇪🇺' },
  { code: 'NA', name: 'North America', nameZh: '北美', flag: '🇺🇸' },
  { code: 'SA', name: 'South America', nameZh: '南美', flag: '🇧🇷' },
  { code: 'SEA', name: 'Southeast Asia', nameZh: '东南亚', flag: '🇹🇭' },
  { code: 'EA', name: 'East Asia', nameZh: '东亚', flag: '🇯🇵' },
  { code: 'MIDEAST', name: 'Middle East', nameZh: '中东', flag: '🇦🇪' },
  { code: 'AF', name: 'Africa', nameZh: '非洲', flag: '🇿🇦' },
  { code: 'OC', name: 'Oceania', nameZh: '大洋洲', flag: '🇦🇺' },
] as const;

// ==================== 默认工厂信息（可配置） ====================
export const DEFAULT_FACTORY_INFO = {
  years: 15,
  capacity: 50000,
  capacityUnit: 'PCS_YEAR',
  countries: 50,
  descriptionEn: 'Professional weighing equipment manufacturer with complete R&D, production, and sales system. Products exported to Europe, North America, Southeast Asia, and more.',
  descriptionZh: '专业衡器制造商，拥有完整的研发、生产、销售体系。产品远销欧洲、北美、东南亚等地区。',
} as const;

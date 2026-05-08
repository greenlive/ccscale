'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Eye, MessageSquare, Search, Filter, Globe, Search as SearchIcon,
  Video, Users, ExternalLink, TrendingUp, ShoppingBag, Mail, Check,
  Clock, XCircle, AlertCircle, RefreshCw, Phone, Linkedin, AlertTriangle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { useAuth } from '@/providers/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 渠道来源配置
const SOURCE_CONFIG = {
  'Google 搜索': { icon: SearchIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Google': { icon: SearchIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  'YouTube': { icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  'LinkedIn': { icon: Users, color: 'text-blue-700', bg: 'bg-blue-50' },
  'TikTok': { icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
  'Instagram': { icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
  'Facebook': { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  'Twitter': { icon: ExternalLink, color: 'text-sky-500', bg: 'bg-sky-50' },
  'X': { icon: ExternalLink, color: 'text-sky-500', bg: 'bg-sky-50' },
  'Alibaba': { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  'Made-in-China': { icon: Globe, color: 'text-red-500', bg: 'bg-red-50' },
  'Direct': { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50' },
  '直接访问': { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50' },
  'Email': { icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
  '邮件': { icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
  'Exhibition': { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
  '展会': { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
  'Referral': { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  '推荐': { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Other': { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50' },
  '其他': { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50' },
  'Website': { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
};

// 所有可用的渠道筛选选项
const ALL_SOURCES = [
  'ALL', 'Google 搜索', 'YouTube', 'LinkedIn', 'TikTok', 'Instagram',
  'Facebook', 'X', 'Alibaba', 'Made-in-China', '直接访问', '邮件', '展会', '推荐', '其他', 'Website',
];

// 状态配置
const STATUS_CONFIG = {
  NEW: { icon: AlertCircle, color: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', label: '新询盘', animate: true },
  READ: { icon: Eye, color: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', label: '已读', animate: false },
  IN_PROGRESS: { icon: Clock, color: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', label: '处理中', animate: false },
  REPLIED: { icon: Check, color: 'green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', label: '已回复', animate: false },
  CLOSED: { icon: XCircle, color: 'gray', bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800', label: '已关闭', animate: false },
  SPAM: { icon: RefreshCw, color: 'red', bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', label: '垃圾', animate: false },
};

// 回复方式配置
const REPLY_METHOD_CONFIG = {
  EMAIL: { icon: Mail, color: 'text-green-600', bg: 'bg-green-50', label: '邮件' },
  WHATSAPP: { icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50', label: 'WhatsApp' },
  PHONE: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', label: '电话' },
  ALIBABA: { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Alibaba' },
  LINKEDIN: { icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
  OTHER: { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50', label: '其他' },
};

interface Activity {
  id: number;
  action: string;
  detail: string | null;
  performedBy: string;
  createdAt: string;
}

interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  company?: string;
  country?: string;
  status: keyof typeof STATUS_CONFIG;
  source?: string | null;
  createdAt: string;
  repliedAt?: string | null;
  repliedBy?: string | null;
  replyMethod?: keyof typeof REPLY_METHOD_CONFIG | null;
  activities?: Activity[];
}

export default function InquiriesPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('30d');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setLoadError(null);
      const response = await fetch(`${API_URL}/api/inquiries?page=1&pageSize=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('询盘列表接口异常');
      }
      const result = await response.json();
      setInquiries(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '加载询盘失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取时间范围筛选
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    if (timeRange === '7d') start.setDate(end.getDate() - 6);
    else if (timeRange === '30d') start.setDate(end.getDate() - 29);
    else if (timeRange === '90d') start.setDate(end.getDate() - 89);
    else if (timeRange === '1y') start.setFullYear(end.getFullYear() - 1);
    else start.setFullYear(end.getFullYear() - 10);
    return { start, end };
  };

  // 今日统计
  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInquiries = inquiries.filter(i => new Date(i.createdAt) >= today);
    return {
      total: todayInquiries.length,
      new: todayInquiries.filter(i => i.status === 'NEW').length,
      replied: todayInquiries.filter(i => i.status === 'REPLIED' && i.repliedAt && new Date(i.repliedAt) >= today).length,
    };
  };

  // 响应时间（小时）
  const getResponseTime = (inquiry: Inquiry) => {
    if (!inquiry.repliedAt) return null;
    const created = new Date(inquiry.createdAt);
    const replied = new Date(inquiry.repliedAt);
    return ((replied.getTime() - created.getTime()) / (1000 * 60 * 60)).toFixed(1);
  };

  useEffect(() => {
    if (token) {
      fetchInquiries();
    }
  }, [token]);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 询盘管理'; }, []);

  const filteredInquiries = useMemo(
    () => {
      const { start, end } = getDateRange();
      return inquiries.filter((inquiry) => {
        const inquiryDate = new Date(inquiry.createdAt);
        const matchesDate = inquiryDate >= start && inquiryDate <= end;
        const matchesSearch =
          inquiry.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inquiry.company && inquiry.company.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'ALL' || inquiry.status === statusFilter;
        const matchesSource =
          sourceFilter === 'ALL' ||
          inquiry.source === sourceFilter ||
          (sourceFilter === '其他' && !inquiry.source) ||
          (sourceFilter === 'Google 搜索' && inquiry.source === 'Google');
        return matchesDate && matchesSearch && matchesStatus && matchesSource;
      });
    },
    [inquiries, searchQuery, statusFilter, sourceFilter, timeRange],
  );

  const todayStats = getTodayStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 计算相对时间
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) {
      const mins = Math.round(diffMs / (1000 * 60));
      return `${mins}分钟前`;
    } else if (diffHours < 24) {
      return `${Math.round(diffHours)}小时前`;
    } else {
      return `${Math.round(diffDays)}天前`;
    }
  };

  // 检查是否超时（超过24小时未回复）
  const isOverdue = (inquiry: Inquiry) => {
    if (inquiry.status === 'REPLIED' || inquiry.status === 'CLOSED' || inquiry.status === 'SPAM') {
      return false;
    }
    const date = new Date(inquiry.createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  // 获取超时时间
  const getOverdueHours = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return Math.round(diffHours);
  };

  const handleStatusChange = async (id: number, newStatus: keyof typeof STATUS_CONFIG) => {
    if (!token) return;
    try {
      setUpdating(id);
      const response = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('状态更新失败');
      }
      const updated = await response.json();
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: updated.status } : inq)));
    } catch (error) {
      alert(error instanceof Error ? error.message : '状态更新失败');
    } finally {
      setUpdating(null);
    }
  };

  // 统计数据
  const stats = {
    total: filteredInquiries.length,
    new: filteredInquiries.filter(i => i.status === 'NEW').length,
    inProgress: filteredInquiries.filter(i => i.status === 'IN_PROGRESS').length,
    replied: filteredInquiries.filter(i => i.status === 'REPLIED').length,
  };

  // 获取渠道来源的图标和样式
  const getSourceStyle = (source: string | null | undefined) => {
    if (!source) {
      return { icon: Globe, color: 'text-gray-400', bg: 'bg-gray-100', label: '未知' };
    }
    const config = SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG];
    if (config) {
      return { ...config, label: source };
    }
    return { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50', label: source };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-terracotta border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (loadError) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-lg font-serif font-medium text-destructive">加载失败</p>
            <p className="text-stone-gray">{loadError}</p>
            <Button onClick={fetchInquiries} variant="accent">重试</Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-foreground">询盘管理</h1>
            <p className="text-stone-gray">管理客户询盘和报价</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-gray">今日新:</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
              {todayStats.new}
            </span>
            <span className="text-sm text-stone-gray">今日回复:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
              {todayStats.replied}
            </span>
            <span className="text-sm text-stone-gray">待处理:</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.new}
            </span>
          </div>
        </div>

        {/* 统计卡片 - Warm parchment theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-whisper transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warm-sand rounded-xl">
                  <MessageSquare className="h-6 w-6 text-olive-gray" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-foreground">{stats.total}</p>
                  <p className="text-sm text-stone-gray">总询盘</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-yellow-300 bg-yellow-50/50 hover:shadow-whisper transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-xl animate-pulse">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-yellow-600">{stats.new}</p>
                  <p className="text-sm text-yellow-700">待处理</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-purple-300 bg-purple-50/50 hover:shadow-whisper transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-purple-600">{stats.inProgress}</p>
                  <p className="text-sm text-purple-700">处理中</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-green-300 bg-green-50/50 hover:shadow-whisper transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-serif font-medium text-green-600">{stats.replied}</p>
                  <p className="text-sm text-green-700">已回复</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Warm parchment theme */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-gray" />
                <Input
                  type="text"
                  placeholder="搜索询盘..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-stone-gray" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 border border-border-warm bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  <option value="ALL">全部状态</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="h-10 px-3 border border-border-warm bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  <option value="ALL">全部渠道</option>
                  {ALL_SOURCES.filter(s => s !== 'ALL').map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="h-10 px-3 border border-border-warm bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  <option value="7d">最近7天</option>
                  <option value="30d">最近30天</option>
                  <option value="90d">最近90天</option>
                  <option value="1y">最近一年</option>
                  <option value="all">全部时间</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries Table - Warm parchment theme */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-cream bg-warm-sand/50">
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">来自</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">公司</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">渠道来源</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">回复方式</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">耗时</th>
                    <th className="text-right py-3 px-4 font-medium text-stone-gray">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry) => {
                    const sourceStyle = getSourceStyle(inquiry.source);
                    const SourceIcon = sourceStyle.icon;
                    const statusConfig = STATUS_CONFIG[inquiry.status];
                    const StatusIcon = statusConfig.icon;
                    const overdue = isOverdue(inquiry);
                    const replyMethodConfig = inquiry.replyMethod ? REPLY_METHOD_CONFIG[inquiry.replyMethod] : null;
                    const ReplyIcon = replyMethodConfig?.icon;

                    return (
                      <tr
                        key={inquiry.id}
                        className={`border-b border-border-cream hover:bg-warm-sand/30 transition-colors ${inquiry.status === 'NEW' ? 'bg-yellow-50/30' : ''} ${overdue ? 'bg-destructive/5' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className={`font-medium ${inquiry.status === 'NEW' ? 'text-yellow-800 font-medium' : 'text-foreground'}`}>
                              {inquiry.status === 'NEW' && (
                                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                              )}
                              {overdue && (
                                <span className="inline-flex items-center gap-1 mr-2 text-destructive">
                                  <AlertTriangle className="h-3 w-3 animate-pulse" />
                                </span>
                              )}
                              {inquiry.fullName}
                            </p>
                            <p className="text-sm text-stone-gray">{inquiry.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-olive-gray">{inquiry.company || '-'}</p>
                          <p className="text-sm text-stone-gray">{inquiry.country || ''}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${sourceStyle.bg}`}>
                              <SourceIcon className={`h-4 w-4 ${sourceStyle.color}`} />
                            </div>
                            <span className="text-sm text-olive-gray">
                              {sourceStyle.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {replyMethodConfig && ReplyIcon ? (
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${replyMethodConfig.bg}`}>
                                <ReplyIcon className={`h-4 w-4 ${replyMethodConfig.color}`} />
                              </div>
                              <span className="text-sm text-olive-gray">
                                {replyMethodConfig.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-stone-gray">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} ${statusConfig.animate ? 'animate-pulse' : ''}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                            {/* 快速操作 */}
                            <div className="flex gap-1 mt-1">
                              {inquiry.status === 'NEW' && (
                                <button
                                  onClick={() => handleStatusChange(inquiry.id, 'IN_PROGRESS')}
                                  className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                                  disabled={updating === inquiry.id}
                                >
                                  处理
                                </button>
                              )}
                              {(inquiry.status === 'NEW' || inquiry.status === 'IN_PROGRESS') && (
                                <button
                                  onClick={() => handleStatusChange(inquiry.id, 'REPLIED')}
                                  className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                  disabled={updating === inquiry.id}
                                >
                                  已回复
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            {/* 已回复询盘显示响应时间 */}
                            {inquiry.repliedAt ? (
                              <>
                                <p className="text-sm text-green-600 font-medium">
                                  {getResponseTime(inquiry)}小时响应
                                </p>
                                <p className="text-xs text-stone-gray">
                                  {getRelativeTime(inquiry.createdAt)}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className={`text-sm ${overdue ? 'text-destructive font-medium' : 'text-stone-gray'}`}>
                                  {getRelativeTime(inquiry.createdAt)}
                                </p>
                                {overdue && (
                                  <p className="text-xs text-destructive">
                                    已超时 {getOverdueHours(inquiry.createdAt) - 24}h
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/inquiries/${inquiry.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              查看
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Copy,
  CheckCircle,
  ExternalLink,
  Search,
  Video,
  Users,
  TrendingUp,
  ShoppingBag,
  Globe,
  Clock,
  ShoppingCart,
  History,
  Send,
  User,
  AlertTriangle,
  Check,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { useAuth } from '@/providers/AuthProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SOURCE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  'Google 搜索': { icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Google 搜索' },
  Google: { icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Google 搜索' },
  YouTube: { icon: Video, color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' },
  LinkedIn: { icon: Users, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
  TikTok: { icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50', label: 'TikTok' },
  Instagram: { icon: Users, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Instagram' },
  Facebook: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Facebook' },
  Twitter: { icon: ExternalLink, color: 'text-sky-500', bg: 'bg-sky-50', label: 'Twitter' },
  X: { icon: ExternalLink, color: 'text-sky-500', bg: 'bg-sky-50', label: 'X (Twitter)' },
  Alibaba: { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Alibaba' },
  'Made-in-China': { icon: Globe, color: 'text-red-500', bg: 'bg-red-50', label: 'Made-in-China' },
  Direct: { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50', label: '直接访问' },
  '直接访问': { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50', label: '直接访问' },
  Email: { icon: Mail, color: 'text-green-600', bg: 'bg-green-50', label: '邮件' },
  邮件: { icon: Mail, color: 'text-green-600', bg: 'bg-green-50', label: '邮件' },
  Exhibition: { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', label: '展会' },
  展会: { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', label: '展会' },
  Referral: { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', label: '推荐' },
  推荐: { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', label: '推荐' },
  Other: { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50', label: '其他' },
  其他: { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50', label: '其他' },
  Website: { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50', label: '网站' },
};

// 回复方式配置
const REPLY_METHOD_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  EMAIL: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50', label: '邮件' },
  WHATSAPP: { icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50', label: 'WhatsApp' },
  PHONE: { icon: Phone, color: 'text-purple-600', bg: 'bg-purple-50', label: '电话' },
  ALIBABA: { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Alibaba' },
  LINKEDIN: { icon: Users, color: 'text-blue-700', bg: 'bg-blue-50', label: 'LinkedIn' },
  OTHER: { icon: ExternalLink, color: 'text-gray-600', bg: 'bg-gray-50', label: '其他' },
};

function getSourceStyle(source?: string | null) {
  if (!source) return { icon: Globe, color: 'text-gray-400', bg: 'bg-gray-100', label: '未知渠道' };
  const config = SOURCE_CONFIG[source];
  if (config) return config;
  return { icon: Globe, color: 'text-gray-500', bg: 'bg-gray-50', label: source };
}

interface ActivityLog {
  id: number;
  action: string;
  detail?: string;
  performedBy: string;
  createdAt: string;
}

interface InquiryData {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  company?: string | null;
  country?: string | null;
  city?: string | null;
  message: string;
  status: string;
  source?: string | null;
  createdAt: string;
  repliedAt?: string | null;
  repliedBy?: string | null;
  replyMethod?: string | null;
  closedReason?: string | null;
  items: Array<{
    productNameEn?: string | null;
    productNameZh?: string | null;
    quantity?: number | null;
  }>;
  activities: ActivityLog[];
}

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  READ: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  REPLIED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  SPAM: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  NEW: '新询盘',
  READ: '已读',
  IN_PROGRESS: '处理中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
  SPAM: '垃圾邮件',
};

const actionLabels: Record<string, string> = {
  CREATED: '创建询盘',
  STATUS_CHANGE: '状态变更',
  REPLIED: '已回复',
  NOTE_ADDED: '添加备注',
  ASSIGNED: '分配销售',
  VIEWED: '查看详情',
};

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return { copied, copy };
}

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { token } = useAuth();
  const { copied, copy } = useCopyToClipboard();
  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [replyMethod, setReplyMethod] = useState<string>('EMAIL');

  useEffect(() => {
    if (token && params.id) {
      fetchInquiry();
    }
  }, [token, params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInquiry = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/inquiries/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('询盘不存在或接口异常');
      const data = await response.json();
      setInquiry(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载询盘失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string, method?: string) => {
    if (!inquiry || !token) return;
    try {
      setStatusUpdating(newStatus);
      const body: any = { status: newStatus, repliedBy: 'Admin' };
      if (method) {
        body.replyMethod = method;
      }
      const response = await fetch(`${API_URL}/api/inquiries/${inquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('更新状态失败');
      const updated = await response.json();
      setInquiry(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : '更新状态失败');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleQuickReply = async (method: string) => {
    // 打开对应的联系方式
    if (method === 'EMAIL' && inquiry) {
      const subject = encodeURIComponent('Re: Inquiry about CC Scale products');
      const body = encodeURIComponent(
        `Dear ${inquiry.fullName},\n\nThank you for your inquiry about our weighing scales.\n\nWe have received your request and would be happy to assist you.\n\nBest regards,\nCC Scale Sales Team`,
      );
      window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
    } else if (method === 'WHATSAPP' && inquiry?.whatsapp) {
      const phone = inquiry.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    } else if (method === 'PHONE' && inquiry?.phone) {
      window.location.href = `tel:${inquiry.phone}`;
    }

    // 同时更新状态
    handleStatusChange('REPLIED', method);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    return formatDate(dateString);
  };

  const getHoursSinceCreation = () => {
    if (!inquiry) return 0;
    const created = new Date(inquiry.createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !inquiry) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto py-10">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-lg font-semibold text-red-600">加载失败</p>
              <p className="text-gray-600">{error || '询盘不存在'}</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => router.back()}>返回上一页</Button>
                <Button onClick={() => window.location.reload()}>重试</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const sourceStyle = getSourceStyle(inquiry.source);
  const SourceIcon = sourceStyle.icon;
  const hoursSinceCreation = getHoursSinceCreation();
  const isOverdue = hoursSinceCreation > 24 && inquiry.status === 'NEW';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#0A1628]">询盘 #{inquiry.id}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                收到于 {formatDate(inquiry.createdAt)}
                {isOverdue && (
                  <span className="flex items-center gap-1 text-red-600 ml-2">
                    <AlertTriangle className="h-4 w-4" />
                    已超时 {hoursSinceCreation - 24} 小时未处理
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[inquiry.status]}`}>
              {statusLabels[inquiry.status]}
            </span>
            {inquiry.replyMethod && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${REPLY_METHOD_CONFIG[inquiry.replyMethod]?.bg || 'bg-gray-100'} ${REPLY_METHOD_CONFIG[inquiry.replyMethod]?.color || 'text-gray-600'}`}>
                {REPLY_METHOD_CONFIG[inquiry.replyMethod]?.label || inquiry.replyMethod}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 询盘内容 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  询盘内容
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{inquiry.message}</p>
              </CardContent>
            </Card>

            {/* 感兴趣的产品 */}
            {inquiry.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    感兴趣的产品
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {inquiry.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-800">{item.productNameZh || item.productNameEn || '未命名产品'}</span>
                        <span className="text-accent font-semibold">数量: {item.quantity || 0}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 操作时间线 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  处理历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inquiry.activities && inquiry.activities.length > 0 ? (
                  <div className="space-y-4">
                    {inquiry.activities.map((log) => (
                      <div key={log.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {log.action === 'STATUS_CHANGE' && <Clock className="h-5 w-5 text-gray-500" />}
                          {log.action === 'REPLIED' && <Check className="h-5 w-5 text-green-500" />}
                          {log.action === 'CREATED' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                          {log.action === 'NOTE_ADDED' && <MessageSquare className="h-5 w-5 text-purple-500" />}
                          {log.action === 'ASSIGNED' && <User className="h-5 w-5 text-orange-500" />}
                          {!['STATUS_CHANGE', 'REPLIED', 'CREATED', 'NOTE_ADDED', 'ASSIGNED'].includes(log.action) && <History className="h-5 w-5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-[#0A1628]">
                              {actionLabels[log.action] || log.action}
                            </span>
                            {log.detail && (
                              <span className="text-gray-600">{log.detail}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{formatRelativeTime(log.createdAt)}</span>
                            <span>·</span>
                            <span>{log.performedBy}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无处理记录</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 快捷回复 */}
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle>🚀 快捷回复</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleQuickReply('EMAIL')}
                    disabled={statusUpdating !== null}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    邮件
                  </Button>
                  {inquiry.whatsapp && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleQuickReply('WHATSAPP')}
                      disabled={statusUpdating !== null}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                  )}
                  {inquiry.phone && (
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleQuickReply('PHONE')}
                      disabled={statusUpdating !== null}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      电话
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center">点击后自动标记为&quot;已回复&quot;并记录回复方式</p>
              </CardContent>
            </Card>

            {/* 联系信息 */}
            <Card>
              <CardHeader>
                <CardTitle>📞 联系信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">姓名</p>
                  <p className="font-medium text-[#0A1628]">{inquiry.fullName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">邮箱</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm text-gray-800 break-all">{inquiry.email}</code>
                    <Button variant="outline" size="sm" onClick={() => copy(inquiry.email, 'email')}>
                      {copied === 'email' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {inquiry.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">电话</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{inquiry.phone}</code>
                      <Button variant="outline" size="sm" onClick={() => copy(inquiry.phone!, 'phone')}>
                        {copied === 'phone' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {inquiry.whatsapp && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm text-gray-800">{inquiry.whatsapp}</code>
                      <Button variant="outline" size="sm" onClick={() => copy(inquiry.whatsapp!, 'whatsapp')}>
                        {copied === 'whatsapp' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {inquiry.company && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">公司</p>
                    <p className="font-medium text-[#0A1628]">{inquiry.company}</p>
                  </div>
                )}

                {inquiry.country && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">地区</p>
                    <p className="font-medium text-[#0A1628]">{[inquiry.city, inquiry.country].filter(Boolean).join(', ')}</p>
                  </div>
                )}

                {/* 回复信息 */}
                {inquiry.repliedAt && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">回复时间</p>
                    <p className="font-medium text-green-600">{formatDate(inquiry.repliedAt)}</p>
                    {inquiry.repliedBy && (
                      <p className="text-xs text-gray-500 mt-1">回复人: {inquiry.repliedBy}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 渠道来源 */}
            <Card>
              <CardHeader>
                <CardTitle>📊 渠道来源</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${sourceStyle.bg}`}>
                    <SourceIcon className={`h-6 w-6 ${sourceStyle.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">来源渠道</p>
                    <p className="font-medium text-[#0A1628]">{sourceStyle.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 状态管理 */}
            <Card>
              <CardHeader>
                <CardTitle>🏷️ 状态管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(key)}
                      disabled={statusUpdating !== null || inquiry.status === key}
                      className={inquiry.status === key ? 'ring-2 ring-accent' : ''}
                    >
                      {statusUpdating === key ? '更新中...' : label}
                    </Button>
                  ))}
                </div>

                {/* 关闭原因 */}
                {inquiry.status === 'CLOSED' && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">关闭原因</p>
                    <p className="text-sm text-gray-700">{inquiry.closedReason || '未填写'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { api } from '@/lib/apiClient';

interface DashboardData {
  summary?: {
    totalSessions?: number;
    uniqueVisitors?: number;
    totalPageViews?: number;
    inquiriesCount?: number;
  };
}

interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  company?: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REPLIED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  NEW: '新询盘',
  IN_PROGRESS: '处理中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return '刚刚';
  if (diffH < 24) return `${diffH}小时前`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}天前`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    productsTotal: 0,
    newInquiries: 0,
    visitors: 0,
    conversion: '0%',
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 仪表板'; }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dashRes, inqRes] = await Promise.all([
          api.get<DashboardData>('/analytics/dashboard'),
          api.get<Inquiry[]>('/inquiries'),
        ]);
        if (cancelled) return;

        const summary = dashRes.data?.summary;
        const visitors = summary?.uniqueVisitors ?? summary?.totalSessions ?? 0;
        const inquiriesCount = summary?.inquiriesCount ?? 0;
        const newInquiries = inqRes.data?.filter((i) => i.status === 'NEW').length ?? 0;
        const conversion = visitors > 0 ? `${((inquiriesCount / visitors) * 100).toFixed(1)}%` : '0%';

        setStats({
          productsTotal: 0,
          newInquiries,
          visitors,
          conversion,
        });
        setRecentInquiries((inqRes.data ?? []).slice(0, 5));
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const statCards = [
    {
      title: '新询盘',
      value: String(stats.newInquiries),
      change: '',
      trend: 'up' as const,
      icon: MessageSquare,
      bgColor: 'bg-coral/10',
      iconColor: 'text-coral',
    },
    {
      title: '访客总数',
      value: stats.visitors.toLocaleString(),
      change: '',
      trend: 'up' as const,
      icon: Users,
      bgColor: 'bg-olive-gray/10',
      iconColor: 'text-olive-gray',
    },
    {
      title: '页面浏览量',
      value: String(stats.visitors),
      change: '',
      trend: 'up' as const,
      icon: Eye,
      bgColor: 'bg-terracotta/10',
      iconColor: 'text-terracotta',
    },
    {
      title: '询盘转化率',
      value: stats.conversion,
      change: '',
      trend: 'up' as const,
      icon: TrendingUp,
      bgColor: 'bg-warm-silver/10',
      iconColor: 'text-warm-silver',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-medium text-foreground">仪表板</h1>
          <p className="text-stone-gray">欢迎回来！这是今天的概览。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-whisper transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-stone-gray mb-1">{stat.title}</p>
                      <p className="text-3xl font-serif font-medium text-foreground">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-4 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>最近询盘</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-stone-gray py-6 text-center">加载中...</p>
            ) : recentInquiries.length === 0 ? (
              <p className="text-stone-gray py-6 text-center">暂无询盘</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-cream">
                      <th className="text-left py-3 px-4 font-medium text-stone-gray">姓名</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-gray">公司</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-gray">状态</th>
                      <th className="text-left py-3 px-4 font-medium text-stone-gray">日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-border-cream hover:bg-warm-sand/30 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{inquiry.fullName}</p>
                            <p className="text-sm text-stone-gray">{inquiry.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-olive-gray">{inquiry.company || '-'}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusLabels[inquiry.status] || inquiry.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-stone-gray">{formatDate(inquiry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

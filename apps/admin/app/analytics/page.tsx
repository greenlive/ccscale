'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, MessageSquare, Package, TrendingUp, Globe } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const COLORS = ['#0A1628', '#ea580c', '#64748b', '#1e3a5f', '#94a3b8', '#f59e0b', '#10b981'];

type DashboardResponse = {
  summary: {
    totalSessions: number;
    uniqueVisitors: number;
    totalPageViews: number;
    inquiriesCount: number;
  };
  trend: Array<{ date: string; visitors: number; pageViews: number; inquiries: number }>;
  sourceDistribution: Array<{ name: string; value: number }>;
  regionDistribution: Array<{ name: string; visitors: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  productInterest: Array<{ name: string; views: number }>;
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [previousSummary, setPreviousSummary] = useState<DashboardResponse['summary'] | null>(null);

  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    if (range === '7d') start.setDate(end.getDate() - 6);
    if (range === '30d') start.setDate(end.getDate() - 29);
    if (range === '90d') start.setDate(end.getDate() - 89);
    if (range === '1y') start.setFullYear(end.getFullYear() - 1);
    return { start, end };
  };

  useEffect(() => { document.title = 'CC Scale 管理后台 - 数据分析'; }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const { start, end } = getDateRange(timeRange);
        const query = `startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
        const response = await fetch(`${API_URL}/api/analytics/dashboard?${query}`);
        if (!response.ok) {
          throw new Error('数据分析接口异常');
        }
        const current = (await response.json()) as DashboardResponse;
        setPreviousSummary(dashboard?.summary || null);
        setDashboard(current);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const trendChartData = useMemo(() => {
    if (!dashboard?.trend) return [];
    return dashboard.trend.map((d) => ({
      ...d,
      name: `${new Date(d.date).getMonth() + 1}/${new Date(d.date).getDate()}`,
    }));
  }, [dashboard]);

  const getChangeText = (current: number, previous: number | null) => {
    if (previous === null || previous === 0) return '—';
    const pct = ((current - previous) / previous) * 100;
    const symbol = pct >= 0 ? '+' : '';
    return `${symbol}${pct.toFixed(1)}%`;
  };

  const stats = [
    {
      title: '总访客数',
      value: dashboard?.summary.uniqueVisitors ?? 0,
      change: getChangeText(dashboard?.summary.uniqueVisitors ?? 0, previousSummary?.uniqueVisitors ?? null),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: '页面浏览',
      value: dashboard?.summary.totalPageViews ?? 0,
      change: getChangeText(dashboard?.summary.totalPageViews ?? 0, previousSummary?.totalPageViews ?? null),
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: '询盘数量',
      value: dashboard?.summary.inquiriesCount ?? 0,
      change: getChangeText(dashboard?.summary.inquiriesCount ?? 0, previousSummary?.inquiriesCount ?? null),
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      title: '产品关注',
      value: dashboard?.productInterest.reduce((sum, i) => sum + i.views, 0) ?? 0,
      change: '—',
      icon: Package,
      color: 'text-purple-600',
    },
  ];

  const statusMeta: Record<string, { label: string; color: string; bg: string; hex: string }> = {
    NEW: { label: '新询盘', color: 'text-yellow-700', bg: 'bg-yellow-500', hex: '#eab308' },
    READ: { label: '已读', color: 'text-blue-700', bg: 'bg-blue-500', hex: '#3b82f6' },
    IN_PROGRESS: { label: '处理中', color: 'text-purple-700', bg: 'bg-purple-500', hex: '#a855f7' },
    REPLIED: { label: '已回复', color: 'text-green-700', bg: 'bg-green-500', hex: '#22c55e' },
    CLOSED: { label: '已关闭', color: 'text-gray-700', bg: 'bg-gray-500', hex: '#6b7280' },
    SPAM: { label: '垃圾', color: 'text-red-700', bg: 'bg-red-500', hex: '#ef4444' },
  };

  const totalStatusCount = (dashboard?.statusDistribution || []).reduce((sum, item) => sum + item.count, 0);
  const statusData = (dashboard?.statusDistribution || []).slice().sort((a, b) => b.count - a.count);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">数据分析</h1>
            <p className="text-gray-600">追踪网站性能和用户行为</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-10 px-3 border border-gray-200 rounded-md"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近一年</option>
          </select>
        </div>

        {error && (
          <Card>
            <CardContent className="p-4 text-red-600">{error}</CardContent>
          </Card>
        )}
        {loading && (
          <Card>
            <CardContent className="p-4 text-gray-500">正在加载分析数据...</CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-[#0A1628]">{stat.value.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className={`h-4 w-4 mr-1 ${stat.color}`} />
                        <p className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-full">
                      <Icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 - 访客趋势和流量来源 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>访客与页面浏览趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    name="访客数"
                    stroke="#0A1628"
                    strokeWidth={2}
                    fill="#0A1628"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    name="页面浏览"
                    stroke="#ea580c"
                    strokeWidth={2}
                    fill="#ea580c"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    name="询盘数"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>流量来源 - 平台分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboard?.sourceDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(dashboard?.sourceDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 - 地区分布 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                访客地区分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard?.regionDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="visitors" name="访客数" fill="#0A1628" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>产品分类浏览</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboard?.productInterest || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="views" name="浏览量" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>询盘状态占比</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-gray-500">暂无状态数据</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  {statusData.map((item) => {
                    const meta = statusMeta[item.status] || {
                      label: item.status,
                      color: 'text-gray-700',
                      bg: 'bg-gray-500',
                      hex: '#6b7280',
                    };
                    const percent = totalStatusCount > 0 ? (item.count / totalStatusCount) * 100 : 0;

                    return (
                      <div key={item.status} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className={`font-medium ${meta.color}`}>{meta.label}</div>
                          <div className="text-gray-600">
                            {item.count} ({percent.toFixed(1)}%)
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className={`h-full ${meta.bg}`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={2}
                        label={({ status, percent }) => {
                          const meta = statusMeta[String(status)] || {
                            label: String(status),
                          };
                          return `${meta.label} ${(Number(percent) * 100).toFixed(0)}%`;
                        }}
                      >
                        {statusData.map((item) => {
                          const meta = statusMeta[item.status] || { hex: '#6b7280' };
                          return <Cell key={item.status} fill={meta.hex} />;
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          const meta = statusMeta[name] || { label: name };
                          return [`${value} 条`, meta.label];
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          const meta = statusMeta[value] || { label: String(value) };
                          return meta.label;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

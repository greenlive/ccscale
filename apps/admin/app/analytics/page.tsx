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

const COLORS = ['#0A1628', '#ea580c', '#64748b', '#1e3a5f', '#94a3b8', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];

// Social media platform colors
const SOCIAL_COLORS: Record<string, string> = {
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  tiktok: '#000000',
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  whatsapp: '#25D366',
  pinterest: '#E60023',
};

type DashboardResponse = {
  summary: {
    totalSessions: number;
    uniqueVisitors: number;
    totalPageViews: number;
    inquiriesCount: number;
  };
  todayStats: { newInquiries: number; repliedInquiries: number; pendingInquiries: number };
  inquiryStatusSummary: { total: number; new: number; replied: number };
  inquiryFunnel: Array<{ status: string; label: string; count: number; color: string }>;
  responseTimeStats: { avgHours: number; within4hCount: number; within4hPercent: number; totalReplied: number };
  replyMethodDistribution: Array<{ method: string; label: string; count: number; color: string }>;
  trend: Array<{ date: string; visitors: number; pageViews: number; inquiries: number }>;
  trafficSourceDistribution: Array<{ name: string; nameZh: string; value: number; color: string }>;
  utmSourceDistribution: Array<{ source: string; sessions: number }>;
  utmMediumDistribution: Array<{ medium: string; sessions: number }>;
  socialMediaBreakdown: Array<{ source: string; sourceKey: string; sessions: number }>;
  allChannels: Array<{ channel: string; source: string; medium: string; sessions: number; inquiries: number }>;
  referrerDistribution: Array<{ domain: string; visits: number }>;
  inquirySourceDistribution: Array<{ name: string; nameZh: string; value: number; color: string }>;
  inquiryUtmDistribution: Array<{ source: string; inquiries: number }>;
  regionDistribution: Array<{ name: string; visitors: number }>;
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
      title: '今日新询盘',
      value: dashboard?.todayStats.newInquiries ?? 0,
      change: '—',
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      title: '今日已回复',
      value: dashboard?.todayStats.repliedInquiries ?? 0,
      change: '—',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: '待回复',
      value: dashboard?.todayStats.pendingInquiries ?? 0,
      change: '—',
      icon: Package,
      color: 'text-red-600',
    },
  ];


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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <CardTitle>流量来源分布</CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.trafficSourceDistribution || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">暂无流量数据</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboard?.trafficSourceDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(dashboard?.trafficSourceDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 - 社媒渠道细分 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298 0 .593.036.88.107V9.4a6.33 6.33 0 00-.88-.065A4.83 4.83 0 003.36 14.3a4.83 4.83 0 001.35 9.57 4.83 4.83 0 009.52-1.36V17.8a8.18 8.18 0 004.83 1.36V9.27a4.85 4.85 0 01-1.78-2.58z"/>
                </svg>
                社媒渠道细分
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.socialMediaBreakdown || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  暂无社媒渠道数据<br/>
                  <span className="text-xs">请确保社媒链接带有UTM参数</span>
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboard?.socialMediaBreakdown || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="source" type="category" stroke="#64748b" width={80} />
                    <Tooltip
                      formatter={(value: number) => [`${value} 次会话`, '会话数']}
                    />
                    <Bar dataKey="sessions" name="会话数" radius={[0, 4, 4, 0]}>
                      {(dashboard?.socialMediaBreakdown || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SOCIAL_COLORS[entry.sourceKey] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UTM营销渠道</CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.utmMediumDistribution || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  暂无UTM数据<br/>
                  <span className="text-xs">使用UTM参数追踪营销活动效果</span>
                </p>
              ) : (
                <div className="space-y-3">
                  {(dashboard?.utmMediumDistribution || []).map((item, index) => {
                    const maxSessions = Math.max(...(dashboard?.utmMediumDistribution?.map(d => d.sessions) || [1]));
                    const percentage = (item.sessions / maxSessions) * 100;
                    return (
                      <div key={item.medium} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{item.medium}</span>
                          <span className="text-gray-600">{item.sessions}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 完整渠道列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              完整流量来源
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(dashboard?.allChannels || []).length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">暂无渠道数据</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">渠道</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">类型</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">会话</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.allChannels || []).map((channel, index) => {
                      const total = (dashboard?.allChannels || []).reduce((sum, c) => sum + c.sessions, 0);
                      const percentage = total > 0 ? ((channel.sessions / total) * 100).toFixed(1) : '0';
                      return (
                        <tr key={channel.channel + index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {channel.medium === 'utm' && (
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: SOCIAL_COLORS[channel.source.toLowerCase()] || COLORS[0] }}
                                />
                              )}
                              {channel.medium === 'referral' && (
                                <span className="w-3 h-3 rounded-full bg-blue-500" />
                              )}
                              {channel.medium === 'organic' && (
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                              )}
                              <span className="font-medium text-gray-800">{channel.channel}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              channel.medium === 'utm' ? 'bg-purple-100 text-purple-800' :
                              channel.medium === 'referral' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {channel.medium === 'utm' ? '社媒' : channel.medium === 'referral' ? '引荐' : '自然'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-medium">{channel.sessions}</td>
                          <td className="py-3 px-2 text-right text-gray-500">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 引荐来源 */}
        {(dashboard?.referrerDistribution || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                引荐来源
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(dashboard?.referrerDistribution || []).map((ref, index) => {
                  const maxVisits = Math.max(...(dashboard?.referrerDistribution?.map(d => d.visits) || [1]));
                  const percentage = (ref.visits / maxVisits) * 100;
                  return (
                    <div key={ref.domain} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{ref.domain}</span>
                        <span className="text-gray-600">{ref.visits}次访问</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Row 3 - 询盘来源分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>询盘来源分布</CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.inquirySourceDistribution || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  暂无询盘来源数据
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboard?.inquirySourceDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(dashboard?.inquirySourceDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>询盘渠道来源（UTM）</CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.inquiryUtmDistribution || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  暂无UTM询盘数据<br/>
                  <span className="text-xs">带UTM参数的询盘将显示在这里</span>
                </p>
              ) : (
                <div className="space-y-3">
                  {(dashboard?.inquiryUtmDistribution || []).map((item, index) => {
                    const total = (dashboard?.inquiryUtmDistribution || []).reduce((sum, d) => sum + d.inquiries, 0);
                    const percentage = total > 0 ? (item.inquiries / total) * 100 : 0;
                    return (
                      <div key={item.source} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{item.source}</span>
                          <span className="text-gray-600">{item.inquiries} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-terracotta transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 4 - 地区和产品分布 */}
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

        {/* 询盘状态统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              询盘状态统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 总览数据 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-[#0A1628]">{dashboard?.inquiryStatusSummary?.total || 0}</div>
                <div className="text-sm text-gray-600 mt-1">总询盘数</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">{dashboard?.inquiryStatusSummary?.new || 0}</div>
                <div className="text-sm text-gray-600 mt-1">新询盘</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{dashboard?.inquiryStatusSummary?.replied || 0}</div>
                <div className="text-sm text-gray-600 mt-1">已回复</div>
              </div>
            </div>

            {/* 回复方式明细 */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">回复方式明细</h4>
              {(dashboard?.replyMethodDistribution || []).length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">暂无回复记录</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(dashboard?.replyMethodDistribution || []).map((item) => {
                    const total = dashboard?.inquiryStatusSummary?.replied || 1;
                    const percent = total > 0 ? (item.count / total) * 100 : 0;
                    return (
                      <div key={item.method} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-800">{item.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 询盘转化漏斗 & 响应时效 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 询盘转化漏斗 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                询盘转化漏斗
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(dashboard?.inquiryFunnel || []).length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">暂无询盘数据</p>
              ) : (
                <div className="space-y-3">
                  {(dashboard?.inquiryFunnel || []).map((item, index) => {
                    const maxCount = Math.max(...(dashboard?.inquiryFunnel?.map(f => f.count) || [1]));
                    const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={item.status} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="font-medium text-gray-700">{item.label}</span>
                          </div>
                          <span className="text-gray-600">{item.count}</span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${width}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 响应时效分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                响应时效分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard?.responseTimeStats?.totalReplied === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">暂无回复数据</p>
              ) : (
                <div className="space-y-6">
                  {/* 平均响应时间 */}
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#0A1628]">
                      {dashboard?.responseTimeStats?.avgHours || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">小时平均响应时间</div>
                  </div>

                  {/* 4小时响应率 */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">4小时内响应</span>
                      <span className="text-lg font-bold text-green-600">
                        {dashboard?.responseTimeStats?.within4hPercent || 0}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-green-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${dashboard?.responseTimeStats?.within4hPercent || 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dashboard?.responseTimeStats?.within4hCount || 0} / {dashboard?.responseTimeStats?.totalReplied || 0} 条询盘
                    </div>
                  </div>

                  {/* 提示 */}
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                    <p>B2B行业最佳实践：4小时内回复询盘可提升50%成交率</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

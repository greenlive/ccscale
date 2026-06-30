'use client';
import { getStoredToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, MessageSquare, Package, TrendingUp, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';
import { getApiUrl } from '@/lib/api';
export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchAnalytics();
  }, []);
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/analytics/dashboard'), {
        headers: {
          'Authorization': `Bearer ${getStoredToken()}`,
        },
       credentials: 'include'});
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (e) {
      console.error('Analytics error:', e);
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  // Mock data for demonstration
  const mockData = {
    summary: {
      totalSessions: 12580,
      uniqueVisitors: 8420,
      totalPageViews: 45890,
      inquiriesCount: 342
    },
    dailyStats: [
      { date: 'Mon', sessions: 1200, pageViews: 4500, inquiries: 25 },
      { date: 'Tue', sessions: 1350, pageViews: 5200, inquiries: 32 },
      { date: 'Wed', sessions: 1100, pageViews: 4100, inquiries: 28 },
      { date: 'Thu', sessions: 1500, pageViews: 5800, inquiries: 38 },
      { date: 'Fri', sessions: 1400, pageViews: 5100, inquiries: 35 },
      { date: 'Sat', sessions: 800, pageViews: 3200, inquiries: 15 },
      { date: 'Sun', sessions: 650, pageViews: 2800, inquiries: 12 }
    ],
    topProducts: [
      { name: 'Digital Body Scale', views: 2450 },
      { name: 'Kitchen Scale', views: 1890 },
      { name: 'Hanging Scale', views: 1560 },
      { name: 'Baby Scale', views: 1230 },
      { name: 'Platform Scale', views: 980 }
    ],
    trafficSources: [
      { source: 'Google', count: 4520 },
      { source: 'Direct', count: 2890 },
      { source: 'Social', count: 1560 },
      { source: 'Referral', count: 890 },
      { source: 'Other', count: 680 }
    ]
  };
  const displayData = data || mockData;
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.summary.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-gray-500">+12.5% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Unique Visitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.summary.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-gray-500">+8.3% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Page Views</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.summary.totalPageViews.toLocaleString()}</div>
              <p className="text-xs text-gray-500">+15.2% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.summary.inquiriesCount}</div>
              <p className="text-xs text-gray-500">+22.1% from last week</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sessions" stroke="#0A1628" strokeWidth={2} />
                  <Line type="monotone" dataKey="pageViews" stroke="#ea580c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={displayData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inquiries" fill="#ea580c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayData.topProducts.map((product: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.views.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(product.views / displayData.topProducts[0].views) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayData.trafficSources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm text-gray-500">{source.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(source.count / displayData.trafficSources[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

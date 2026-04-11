'use client';

import { useState } from 'react';
import {
  Package,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';

const stats = [
  {
    title: '产品总数',
    value: '156',
    change: '+12',
    trend: 'up',
    icon: Package,
    color: 'bg-blue-50',
  },
  {
    title: '新询盘',
    value: '24',
    change: '+5',
    trend: 'up',
    icon: MessageSquare,
    color: 'bg-orange-50',
  },
  {
    title: '访客总数',
    value: '1,245',
    change: '+89',
    trend: 'up',
    icon: Users,
    color: 'bg-green-50',
  },
  {
    title: '转化率',
    value: '3.2%',
    change: '-0.5',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-purple-50',
  },
];

const recentInquiries = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    company: 'Global Imports',
    status: 'NEW',
    date: '2小时前',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria@example.com',
    company: 'EuroTrade Ltd',
    status: 'IN_PROGRESS',
    date: '5小时前',
  },
  {
    id: 3,
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    company: 'Middle East Trading',
    status: 'REPLIED',
    date: '1天前',
  },
  {
    id: 4,
    name: 'Yuki Tanaka',
    email: 'yuki@example.com',
    company: 'Japan Import Co',
    status: 'NEW',
    date: '1天前',
  },
];

const statusColors = {
  NEW: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REPLIED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  NEW: '新询盘',
  IN_PROGRESS: '处理中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
};

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628]">仪表板</h1>
          <p className="text-gray-600">欢迎回来！这是今天的概览。</p>
        </div>

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
                      <p className="text-3xl font-bold text-[#0A1628]">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`flex items-center text-sm ${
                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {stat.trend === 'up' ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">较上周</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-4 rounded-full`}>
                      <Icon className="h-6 w-6 text-[#0A1628]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>最近询盘</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">姓名</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">公司</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">日期</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-[#0A1628]">{inquiry.name}</p>
                          <p className="text-sm text-gray-500">{inquiry.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{inquiry.company}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[inquiry.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[inquiry.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500">{inquiry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

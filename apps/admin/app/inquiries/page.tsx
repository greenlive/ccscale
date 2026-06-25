'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Eye, MessageSquare, Search, Filter, Globe,
  Video, Users, ExternalLink, TrendingUp, ShoppingBag, Mail,
  Clock, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button, Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { useAuth } from '@/providers/AuthProvider';
import { getApiUrl } from '@/lib/api';

const SOURCE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  'Google': { icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
  'YouTube': { icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  'LinkedIn': { icon: Users, color: 'text-blue-700', bg: 'bg-blue-50' },
  'TikTok': { icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
  'Alibaba': { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  'Direct': { icon: Globe, color: 'text-gray-600', bg: 'bg-gray-50' },
  'Email': { icon: Mail, color: 'text-green-600', bg: 'bg-green-50' },
  'Referral': { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Website': { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
};

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(getApiUrl('/inquiries'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesSearch = searchTerm === '' || 
        inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = filterSource === 'ALL' || inquiry.source === filterSource;
      const matchesStatus = filterStatus === 'ALL' || inquiry.status === filterStatus;
      
      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [inquiries, searchTerm, filterSource, filterStatus]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
          <Button onClick={fetchInquiries} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inquiries.filter(i => i.status === 'NEW').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {inquiries.filter(i => i.status === 'PENDING').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {inquiries.filter(i => i.status === 'COMPLETED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <Input
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="ALL">All Sources</option>
                {Object.keys(SOURCE_CONFIG).map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="ALL">All Status</option>
                <option value="NEW">New</option>
                <option value="PENDING">Pending</option>
                <option value="REPLIED">Replied</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No inquiries found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{inquiry.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{inquiry.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{inquiry.company || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          {SOURCE_CONFIG[inquiry.source] ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${SOURCE_CONFIG[inquiry.source].bg} ${SOURCE_CONFIG[inquiry.source].color}`}>
                              {inquiry.source}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              {inquiry.source || 'Direct'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                            inquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            inquiry.status === 'REPLIED' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/inquiries/${inquiry.id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
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
/**
 * Web Vitals Dashboard (Admin)
 *
 * Reads aggregated metrics from /api/analytics/vitals/summary
 * - Shows P50/P75/P90 for LCP, INP, CLS, FCP, TTFB
 * - Per-page breakdown
 * - Time-range filter: 24h / 7d / 30d
 */
'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';

interface MetricSummary {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  p50: number;
  p75: number;
  p90: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: 'ms' | 's';
}

interface PageBreakdown {
  path: string;
  samples: number;
  lcpP75: number;
  clsP75: number;
  inpP75: number;
}

const RANGES = [
  { key: '24h', label: 'Last 24h' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function WebVitalsPage() {
  const [range, setRange] = useState<typeof RANGES[number]['key']>('7d');
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [pages, setPages] = useState<PageBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/vitals/summary?range=${range}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMetrics(data.metrics || []);
      setPages(data.pages || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      // Demo data when API not available
      setMetrics([
        { name: 'LCP', p50: 1800, p75: 2200, p90: 3000, rating: 'good', unit: 'ms' },
        { name: 'INP', p50: 120, p75: 180, p90: 280, rating: 'good', unit: 'ms' },
        { name: 'CLS', p50: 0.04, p75: 0.08, p90: 0.15, rating: 'good', unit: 's' },
        { name: 'FCP', p50: 1200, p75: 1500, p90: 2000, rating: 'good', unit: 'ms' },
        { name: 'TTFB', p50: 280, p75: 400, p90: 700, rating: 'good', unit: 'ms' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-7 w-7 text-primary" />
              Web Vitals
            </h1>
            <p className="text-gray-600 mt-1">Real-user performance metrics from Sentry / GA4</p>
          </div>
          <div className="flex gap-2 items-center">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  range === r.key ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">API endpoint not available</p>
              <p className="text-sm text-amber-700 mt-1">
                {error}. Showing demo data. Implement <code className="bg-amber-100 px-1 rounded">GET /api/analytics/vitals/summary</code> in your backend
                (NestJS or Next.js API route) to aggregate the metrics sent by <code className="bg-amber-100 px-1 rounded">/api/analytics/vitals</code>.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.name} metric={m} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance by page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3 text-sm font-medium text-gray-600">Page</th>
                    <th className="py-2 px-3 text-sm font-medium text-gray-600">Samples</th>
                    <th className="py-2 px-3 text-sm font-medium text-gray-600">LCP p75</th>
                    <th className="py-2 px-3 text-sm font-medium text-gray-600">INP p75</th>
                    <th className="py-2 px-3 text-sm font-medium text-gray-600">CLS p75</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                        No per-page data yet. Once users hit the site, this table will populate.
                      </td>
                    </tr>
                  ) : (
                    pages.map((p) => (
                      <tr key={p.path} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-mono text-sm">{p.path}</td>
                        <td className="py-2 px-3 text-sm">{p.samples}</td>
                        <td className="py-2 px-3 text-sm">{formatMetric(p.lcpP75, 'ms')}</td>
                        <td className="py-2 px-3 text-sm">{formatMetric(p.inpP75, 'ms')}</td>
                        <td className="py-2 px-3 text-sm">{formatMetric(p.clsP75, 's')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Core Web Vitals thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-3 font-medium text-gray-600">Metric</th>
                  <th className="py-2 px-3 font-medium text-green-700">Good</th>
                  <th className="py-2 px-3 font-medium text-amber-700">Needs improvement</th>
                  <th className="py-2 px-3 font-medium text-red-700">Poor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">LCP</td><td className="py-2 px-3">≤ 2.5s</td><td className="py-2 px-3">≤ 4s</td><td className="py-2 px-3">&gt; 4s</td></tr>
                <tr className="border-b"><td className="py-2 px-3">INP</td><td className="py-2 px-3">≤ 200ms</td><td className="py-2 px-3">≤ 500ms</td><td className="py-2 px-3">&gt; 500ms</td></tr>
                <tr className="border-b"><td className="py-2 px-3">CLS</td><td className="py-2 px-3">≤ 0.1</td><td className="py-2 px-3">≤ 0.25</td><td className="py-2 px-3">&gt; 0.25</td></tr>
                <tr className="border-b"><td className="py-2 px-3">FCP</td><td className="py-2 px-3">≤ 1.8s</td><td className="py-2 px-3">≤ 3s</td><td className="py-2 px-3">&gt; 3s</td></tr>
                <tr><td className="py-2 px-3">TTFB</td><td className="py-2 px-3">≤ 800ms</td><td className="py-2 px-3">≤ 1.8s</td><td className="py-2 px-3">&gt; 1.8s</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function MetricCard({ metric }: { metric: MetricSummary }) {
  const colorClass =
    metric.rating === 'good' ? 'bg-green-50 border-green-200' :
    metric.rating === 'needs-improvement' ? 'bg-amber-50 border-amber-200' :
    'bg-red-50 border-red-200';

  const textColor =
    metric.rating === 'good' ? 'text-green-700' :
    metric.rating === 'needs-improvement' ? 'text-amber-700' :
    'text-red-700';

  const Icon = metric.rating === 'good' ? TrendingUp : TrendingDown;

  return (
    <div className={`rounded-lg border p-5 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
        <Icon className={`h-4 w-4 ${textColor}`} />
      </div>
      <div className={`text-3xl font-bold ${textColor}`}>
        {formatMetric(metric.p75, metric.unit)}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        p50: {formatMetric(metric.p50, metric.unit)} · p90: {formatMetric(metric.p90, metric.unit)}
      </div>
    </div>
  );
}

function formatMetric(value: number, unit: 'ms' | 's'): string {
  if (unit === 's' && value < 1) return value.toFixed(3);
  if (unit === 's') return `${value.toFixed(2)}s`;
  return `${Math.round(value)}ms`;
}
import { NextResponse } from 'next/server';

/**
 * Health check endpoint for container orchestration and monitoring
 * 
 * Returns:
 * - 200 OK with status details when healthy
 * - 503 Service Unavailable if critical dependencies fail
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      api: await checkApiHealth(),
      memory: checkMemoryHealth(),
    },
  };

  const isHealthy = health.checks.memory.usagePercent < 90;

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Health-Status': isHealthy ? 'ok' : 'degraded',
    },
  });
}

async function checkApiHealth(): Promise<{ status: string; latency?: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const start = Date.now();
    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const latency = Date.now() - start;

    if (!response.ok) {
      return { status: 'unhealthy', latency };
    }

    return { 
      status: 'healthy', 
      latency 
    };
  } catch (error) {
    return { status: 'unhealthy' };
  }
}

function checkMemoryHealth(): { status: string; usagePercent: number; used: number; total: number } {
  const usage = process.memoryUsage();
  const totalHeap = usage.heapTotal;
  const usedHeap = usage.heapUsed;
  const usagePercent = Math.round((usedHeap / totalHeap) * 100);

  return {
    status: usagePercent < 80 ? 'healthy' : usagePercent < 90 ? 'warning' : 'critical',
    usagePercent,
    used: Math.round(usedHeap / 1024 / 1024),
    total: Math.round(totalHeap / 1024 / 1024),
  };
}
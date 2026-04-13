'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut } from 'lucide-react';
import { Button } from '@cc-scale/ui';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-parchment">
        <Sidebar />
        <div className="lg:pl-64">
          {/* Top bar - Warm parchment theme */}
          <div className="sticky top-0 z-40 bg-ivory border-b border-border-cream px-4 py-3 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden flex items-center gap-2">
              <span className="font-serif font-medium text-foreground">CC Scale</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-olive-gray">
                {user?.name} <span className="text-stone-gray">({user?.role})</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-stone-gray hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-1" />
                退出
              </Button>
            </div>
          </div>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
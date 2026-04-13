'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Scale,
  Star,
  Building2,
  Users,
  FolderOpen,
  Download,
} from 'lucide-react';
import { cn } from '@cc-scale/ui';

const menuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: '仪表板',
  },
  {
    href: '/products',
    icon: Package,
    label: '产品管理',
  },
  {
    href: '/categories',
    icon: FolderOpen,
    label: '分类管理',
  },
  {
    href: '/inquiries',
    icon: MessageSquare,
    label: '询盘管理',
    badge: '5',
  },
  {
    href: '/testimonials',
    icon: Star,
    label: '客户心声',
  },
  {
    href: '/clients',
    icon: Building2,
    label: '合作伙伴',
  },
  {
    href: '/downloads',
    icon: Download,
    label: '下载管理',
  },
  {
    href: '/analytics',
    icon: BarChart3,
    label: '数据分析',
  },
  {
    href: '/users',
    icon: Users,
    label: '用户管理',
  },
  {
    href: '/settings',
    icon: Settings,
    label: '系统设置',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-dark-surface">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border-dark">
        <Scale className="h-8 w-8 text-terracotta mr-2" />
        <span className="text-xl font-serif font-medium text-ivory">CC Scale</span>
        <span className="ml-2 text-xs text-warm-silver">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-terracotta text-ivory shadow-ring-terracotta'
                  : 'text-warm-silver hover:bg-white/10 hover:text-ivory'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-destructive text-ivory text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border-dark">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-terracotta/20 rounded-full flex items-center justify-center">
            <span className="text-terracotta font-medium">AD</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-ivory">Admin User</p>
            <p className="text-xs text-warm-silver">admin@ccscale.com</p>
          </div>
          <button className="text-warm-silver hover:text-ivory">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-surface text-ivory rounded-lg"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </div>
    </>
  );
}
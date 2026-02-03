//@ts-nocheck
//ts-nocheck

import type React from 'react';
import { useAtom } from 'jotai';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FolderTree,
  BarChart3,
  Settings,
  LogOut,
  X,
  Menu,
  Ticket,
} from 'lucide-react';
import { sidebarOpenAtom } from '../state/adminAtoms';
import { useLogout } from '@/queries/hooks/auth/useAuth';

export const Sidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const location = useLocation();
  const logoutMutation = useLogout();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin',
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: location.pathname.startsWith('/admin/products'),
      // badge: "124",
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      current: location.pathname.startsWith('/admin/categories'),
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: location.pathname.startsWith('/admin/orders'),
      // badge: "12",
    },
    {
      name: 'Coupons',
      href: '/admin/coupons',
      icon: Ticket,
      current: location.pathname.startsWith('/admin/coupons'),
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname.startsWith('/admin/users'),
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname.startsWith('/admin/analytics'),
    },
    // {
    //   name: 'Settings',
    //   href: '/admin/settings',
    //   icon: Settings,
    //   current: location.pathname.startsWith('/admin/settings'),
    // },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#0e1e16' }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-green-300">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {/* {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-600 text-white"
                    >
                      {item.badge}
                    </Badge>
                  )} */}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};

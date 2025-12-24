'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: '/protected/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/protected/contacts', label: 'Contacts', icon: Users },
    { href: '/protected/send-sms', label: 'Send SMS', icon: MessageSquare },
    { href: '/protected/reports', label: 'Reports', icon: BarChart3 },
    { href: '/protected/activity-logs', label: 'Activity', icon: Activity },
  ];

  // Add user management for superadmin
  if ((session?.user as any)?.role === 'SUPERADMIN') {
    navItems.push({
      href: '/protected/users',
      label: 'Users',
      icon: Settings,
    });
  }

  return (
    <nav className="w-64 bg-white shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Mass SMS</h1>
            <p className="text-xs text-gray-500">SMS Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        {session && (
          <div className="px-4 py-2">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.user?.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Role: {(session.user as any)?.role || 'ADMIN'}
            </p>
          </div>
        )}
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;

'use client';

import { usePathname } from 'next/navigation';
import Link from "next/link";
import { LayoutDashboard, Wrench, Users, CreditCard, BarChart3, Receipt, Download, Star, Package, Settings, Shield, Ticket } from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tools", label: "Tools", icon: Wrench },
  { href: "/admin/bundles", label: "Bundles", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/payments", label: "Payments", icon: Receipt },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/extension", label: "Admin Extension", icon: Download },
  { href: "/admin/reviews", label: "Reviews & Proofs", icon: Star },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-gray-700 p-6 sticky top-24">
        {/* Admin Badge */}
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border-l-4 border-purple-600 dark:border-purple-400"
                    : "hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

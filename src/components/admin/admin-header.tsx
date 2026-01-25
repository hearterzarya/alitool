'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User, MessageCircle } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg group-hover:shadow-lg transition-shadow">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Management Dashboard</p>
              </div>
            </Link>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-full">
                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-slate-900 dark:text-white">
                  {user.name || 'Admin'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            {/* WhatsApp Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366]"
            >
              <a
                href={`https://wa.me/919155313223?text=${encodeURIComponent('Hello! I need admin support.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

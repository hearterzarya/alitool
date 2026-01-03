'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sparkles, User } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GrowTools</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tools" className="text-sm font-medium hover:text-primary transition">
              Tools
            </Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
                Dashboard
              </Link>
            )}
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            ) : session ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.name || session.user?.email}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

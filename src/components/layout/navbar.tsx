'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Wrench, Star, FileText, HelpCircle, Menu, X, Home, Shield } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/tools', label: 'Tools', icon: Wrench },
    { href: '/features', label: 'Features', icon: Star },
    { href: '/reviews', label: 'Reviews/Proofs', icon: FileText },
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200 backdrop-blur-xl bg-white/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              AliDigitalSolution


            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 group relative"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </Link>
              );
            })}
            {session && (session.user as any)?.role !== 'ADMIN' && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 group relative"
              >
                <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-lg" />
            ) : session ? (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-0 relative group"
                >
                  <Link 
                    href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/dashboard"}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative">
                      {(session.user as any)?.role === 'ADMIN' ? (
                        <Shield className="h-4 w-4 text-purple-600" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {(session.user as any)?.role === 'ADMIN' && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-600 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <span className="hidden lg:inline">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <span className="hidden lg:inline ml-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-700 rounded-md border border-purple-200">
                        Admin
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-0"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {session && (
                <Link
                  href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                >
                  <div className="relative">
                    {(session.user as any)?.role === 'ADMIN' ? (
                      <Shield className="h-4 w-4 text-purple-600" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    {(session.user as any)?.role === 'ADMIN' && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-600 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <span>{(session.user as any)?.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}</span>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-700 rounded-md border border-purple-200">
                      Admin
                    </span>
                  )}
                </Link>
              )}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                {status === "loading" ? (
                  <div className="h-10 w-full bg-slate-200 animate-pulse rounded-lg" />
                ) : session ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                    >
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

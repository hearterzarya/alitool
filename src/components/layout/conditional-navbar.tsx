'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on auth pages and admin pages (admin has its own header)
  const hideNavbar = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/admin');
  
  if (hideNavbar) {
    return null;
  }
  
  return <Navbar />;
}


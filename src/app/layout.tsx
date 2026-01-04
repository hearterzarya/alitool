import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrowTools - Access Premium AI Tools",
  description: "Subscribe to premium AI tools like ChatGPT Plus, Claude Pro, Midjourney and more. Affordable monthly subscriptions starting at $5/month.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ConditionalNavbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

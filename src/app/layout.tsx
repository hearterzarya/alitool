import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "@/components/providers/session-provider";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { TelegramButton } from "@/components/layout/telegram-button";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AliDigitalSolution - Access Premium AI Tools",
  description: "Subscribe to premium AI tools like ChatGPT Plus, Claude Pro, Midjourney and more. Affordable monthly subscriptions starting at ₹50/month.",
};

// Use env only in layout so we never touch the DB here — layout always loads
const WHATSAPP_NUMBER = (typeof process.env.WHATSAPP_NUMBER === "string" && process.env.WHATSAPP_NUMBER.trim()) || "919155313223";
const WHATSAPP_MESSAGE = (typeof process.env.WHATSAPP_DEFAULT_MESSAGE === "string" && process.env.WHATSAPP_DEFAULT_MESSAGE.trim()) || "Hello! I need help with my subscription.";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AnalyticsScripts />
        <SessionProvider>
          <ConditionalNavbar />
          {children}
          <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} message={WHATSAPP_MESSAGE} />
          <TelegramButton />
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "@/components/providers/session-provider";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AliDigitalSolution - Access Premium AI Tools",
  description: "Subscribe to premium AI tools like ChatGPT Plus, Claude Pro, Midjourney and more. Affordable monthly subscriptions starting at ₹50/month.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let whatsapp = { number: "919155313223", defaultMessage: "Hello! I need help with my subscription." };
  try {
    whatsapp = await getWhatsAppConfig();
  } catch (_e) {
    // Fallback so layout never crashes
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AnalyticsScripts />
        <SessionProvider>
          <ConditionalNavbar />
          {children}
          <WhatsAppButton phoneNumber={whatsapp.number} message={whatsapp.defaultMessage} />
        </SessionProvider>
      </body>
    </html>
  );
}

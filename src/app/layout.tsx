import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TravelAdvisorWidget } from "@/components/chat/travel-advisor-widget";
import { BackToTop } from "@/components/layout/back-to-top";
import { Fab } from "@/components/layout/fab";
import "./globals.css";

export const runtime = "nodejs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ),
  title: {
    default: "旅游管理 — 探索世界，记录旅程",
    template: "%s | 旅游管理",
  },
  description: "发现热门旅游目的地，分享你的旅行体验。提供景点、美食、住宿一站式信息管理与分享服务。",
  keywords: ["旅游", "目的地", "景点", "美食", "住宿", "旅行攻略", "自由行"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "旅游管理",
    title: "旅游管理 — 探索世界，记录旅程",
    description: "发现热门旅游目的地，分享你的旅行体验",
  },
  twitter: {
    card: "summary_large_image",
    title: "旅游管理 — 探索世界，记录旅程",
    description: "发现热门旅游目的地，分享你的旅行体验",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main className="page-enter">{children}</main>
          <Footer />
          <Toaster position="top-center" />
          <TravelAdvisorWidget />
          <BackToTop />
          <Fab />
        </ThemeProvider>
      </body>
    </html>
  );
}

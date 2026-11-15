import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TravelAdvisorWidget } from "@/components/chat/travel-advisor-widget";
import { BackToTop } from "@/components/layout/back-to-top";
import "./globals.css";

export const runtime = "nodejs";

const geistSans = Inter({
  variable: "--font-inter",
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:p-3 focus:text-primary-foreground">跳至主要内容</a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main id="main-content" className="page-enter min-h-[65vh]">{children}</main>
          <Footer />
          <Toaster position="top-center" />
          <TravelAdvisorWidget />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}

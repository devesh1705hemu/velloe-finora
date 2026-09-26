import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { DemoBanner } from "@/features/auth/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://velloe-finora.io"),
  title: {
    default: "Velloe-Finora — Your money has a future. See it.",
    template: "%s | Velloe-Finora",
  },
  description:
    "Velloe-Finora transforms financial activity into actionable insights, potential savings opportunities, and future scenarios. An enterprise-ready financial intelligence platform.",
  keywords: [
    "financial intelligence",
    "money leakage detection",
    "future simulation",
    "financial forecasting",
    "cash flow intelligence",
    "AI financial co-pilot",
    "capital allocation",
    "fintech",
    "enterprise finance",
    "velloe-finora",
  ],
  authors: [{ name: "Velloe-Finora Technologies" }],
  creator: "Velloe-Finora",
  publisher: "Velloe-Finora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://velloe-finora.io",
    title: "Velloe-Finora — Your money has a future. See it.",
    description:
      "Velloe-Finora transforms financial activity into actionable insights, potential savings opportunities, and future scenarios.",
    siteName: "Velloe-Finora",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Velloe-Finora — Enterprise Financial Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velloe-Finora — Your money has a future. See it.",
    description:
      "Velloe-Finora transforms financial activity into actionable insights, potential savings opportunities, and future scenarios.",
    images: ["/og-image.png"],
    creator: "@velloe_finora",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary">
        <AppProviders>
          <DemoBanner />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GsapAnimations from "@/components/GsapAnimations";
import EarlyAccessRoot from "@/components/EarlyAccessRoot";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentPatrol · Runtime Security for AI Agents",
  description:
    "AgentPatrol sits below your agent stack and enforces exactly what AI agents can and cannot do. Kernel-level security for autonomous AI.",
  keywords: "AI agent security, runtime security, kernel-level, LangChain security, autonomous AI",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "AgentPatrol · Runtime Security for AI Agents",
    description: "AgentPatrol sits below your agent stack and enforces exactly what AI agents can and cannot do. Kernel-level security for autonomous AI.",
    siteName: "AgentPatrol",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <EarlyAccessRoot>
          {children}
          <GsapAnimations />
        </EarlyAccessRoot>
      </body>
    </html>
  );
}

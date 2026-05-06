import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import GsapAnimations from "@/components/GsapAnimations";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const teknolog = localFont({
  src: "./fonts/nb_architekt_bold.woff2",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentPatrol — Runtime Security for AI Agents",
  description:
    "AgentPatrol sits below your agent stack and enforces exactly what AI agents can and cannot do. Kernel-level security for autonomous AI.",
  keywords: "AI agent security, runtime security, kernel-level, LangChain security, autonomous AI",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "AgentPatrol — Runtime Security for AI Agents",
    description: "AgentPatrol sits below your agent stack and enforces exactly what AI agents can and cannot do. Kernel-level security for autonomous AI.",
    siteName: "AgentPatrol",
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
      className={`${inter.variable} ${teknolog.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GsapAnimations />
      </body>
    </html>
  );
}

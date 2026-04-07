import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstroBook | 高级记账系统",
  description: "全栈深色拟态记账本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

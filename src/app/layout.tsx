import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN">
      <body>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/commons/header'; // 경로가 다르면 수정하세요

export const metadata: Metadata = {
  title: "PROJECT STOCK",
  description: "Virtual Stock Trading Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-black">
        {/* AuthProvider가 최상위에서 감싸야 Header에서 useAuth를 쓸 수 있습니다. */}
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
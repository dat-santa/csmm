// ✅ Import kiểu dữ liệu `Metadata` dùng để khai báo thông tin SEO
import type { Metadata } from "next";

// ✅ Import 2 font chữ từ Google thông qua Next.js font optimization
import { Geist, Geist_Mono } from "next/font/google";

// ✅ Import file CSS toàn cục
import "./globals.css";

// ✅ Import component Header (phía client) để hiển thị trên mọi trang
import Header from "@/components/Header";

// ✅ Khởi tạo font Geist Sans với biến CSS để áp dụng cho toàn app
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ✅ Tương tự với Geist Mono (font monospace)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Metadata cho SEO: sẽ được nhúng vào <head> ở HTML (thẻ <title>, <meta>)
export const metadata: Metadata = {
  title: "Cuộc sống muôn màu",          // Tiêu đề hiển thị trên tab trình duyệt
  description: "Phát triển mỗi ngày",   // Mô tả dùng cho SEO
};

// ✅ Root layout: được dùng làm bố cục khung chính cho toàn bộ app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // ✅ Gán biến font từ Next.js fonts + bật antialiasing cho đẹp chữ
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header /> {/* ✅ Hiển thị Header trên mọi trang */}
        {children} {/* ✅ Render nội dung cụ thể của từng trang */}
      </body>
    </html>
  );
}

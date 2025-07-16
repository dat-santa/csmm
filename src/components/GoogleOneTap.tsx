"use client"; // ✅ Bắt buộc để chạy mã trên trình duyệt (Next.js App Router)

import { useEffect } from "react";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";

// ✅ Lấy client ID từ biến môi trường
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

// ✅ Tạo Supabase client phía client-side
const supabase = createClient();

export default function GoogleOneTap() {
  // ✅ Hàm này được gọi khi script Google load xong
  const handleGoogleLoad = async () => {
    // 🔒 Kiểm tra nếu Google SDK đã có và clientId hợp lệ
    if (!window.google || !clientId) return;
  
    // ✅ Kiểm tra trạng thái đăng nhập Supabase trước
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return; // ⛔ Nếu đã đăng nhập rồi thì KHÔNG gọi One Tap nữa

    // ✅ Khởi tạo Google One Tap
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        const { credential } = response;
        if (!credential) return;

        // ✅ Gửi token đến Supabase để đăng nhập
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
        });

        if (error) {
          console.error("Google One Tap login failed:", error.message);
        }
      },
      auto_select: true, // ✅ Tự động chọn nếu người dùng đã đăng nhập trước đó
    });

    // ✅ Hiển thị One Tap popup
    window.google.accounts.id.prompt();
  };

  return (
    // ✅ Tải Google One Tap SDK và gọi `handleGoogleLoad` khi script đã sẵn sàng
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive" // ✅ Tải sau khi page đã interactive (đề xuất bởi Next.js)
      onLoad={handleGoogleLoad} // ✅ Gọi init đúng thời điểm, sau khi load xong script moi goi OneTap
    />
  );
}

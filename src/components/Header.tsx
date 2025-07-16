"use client"; // ✅ Bắt buộc để component chạy trên client-side (vì dùng useEffect, useState)

// ✅ Import các hook React
import { useEffect, useState } from "react";

// ✅ Import hàm tạo Supabase client phía client-side
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// ✅ Khởi tạo Supabase client để dùng cho auth, user, v.v.
const supabase = createClient();

// ✅ Component Header hiển thị logo + avatar
export default function Header() {
  // ✅ State để lưu đường dẫn avatar người dùng sau khi đăng nhập
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // ✅ Khi component mount, gọi API để lấy thông tin người dùng hiện tại từ Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // Gọi Supabase lấy user

      if (user) {
        // ✅ Ưu tiên lấy avatar từ user_metadata
        const avatarUrl =
          user.user_metadata.avatar_url || user.user_metadata.picture || null;

        setUserAvatar(avatarUrl); // ✅ Cập nhật state để render avatar
      }
    };

    fetchUser(); // ✅ Gọi ngay khi component được mount
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 shadow-sm border-b bg-white dark:bg-zinc-900">
      {/* ✅ Logo bên trái */}
      <div className="text-xl font-bold text-blue-600 dark:text-white">CSMM</div>

      {/* ✅ Avatar người dùng bên phải */}
      <div className="flex items-center space-x-2">
        {userAvatar ? (
          // ✅ Nếu đã có avatar, hiển thị ảnh tròn
          <Image
            src={userAvatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          // ✅ Nếu chưa có avatar (đang loading hoặc chưa đăng nhập), hiển thị hình tròn xám
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
        )}
      </div>
    </header>
  );
}

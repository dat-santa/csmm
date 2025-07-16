// 📦 Import Supabase server-side client
import { createClient } from "@/lib/supabase/server";

import Image from "next/image";

// 🧾 Khai báo kiểu props cho component
interface UserPageProps {
  params: {
    username: string;
  };
}

// 🧠 Component server-side: trang cá nhân người dùng
export default async function UserProfile({ params }: UserPageProps) {
  // ✅ Tạo Supabase client cho môi trường server
  const supabase = await createClient();

  // 🔍 Truy vấn người dùng theo `username`
  const { data: user, error } = await supabase
    .from("users")
    .select("username, full_name, bio, avatar_url")
    .eq("username", params.username)
    .single();

  // ❌ Trường hợp không tìm thấy user hoặc có lỗi truy vấn
  if (error || !user) {
    return (
      <div className="p-6 text-center text-red-500">
        Người dùng <b>@{params.username}</b> không tồn tại.
      </div>
    );
  }

  // ✅ Trả về giao diện hồ sơ người dùng
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        {/* Avatar người dùng */}
        <Image
          src={user.avatar_url || "/default-avatar.png"}
          alt={`Avatar of ${user.username}`}
          className="w-16 h-16 rounded-full object-cover border"
        />

        {/* Tên và username */}
        <div>
          <h1 className="text-2xl font-semibold">@{user.username}</h1>
          {user.full_name && (
            <p className="text-gray-600 dark:text-gray-400">
              {user.full_name}
            </p>
          )}
        </div>
      </div>

      {/* Tiểu sử cá nhân */}
      {user.bio && (
        <div className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {user.bio}
        </div>
      )}
    </div>
  );
}

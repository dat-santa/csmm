// 📦 Import Supabase server-side client
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

// 🧾 Định nghĩa props cho component, dùng đúng kiểu của App Router
type UserProfileProps = {
  params: {
    username: string;
  };
};

// 🕒 Cấu hình ISR: dữ liệu sẽ revalidate mỗi 60 giây
export const revalidate = 60;

// 🧠 Component server-side: trang hồ sơ người dùng
export default async function UserProfile({
    params 
}: {
    params: {username: string }
}) {

  // ✅ Tạo Supabase client (không cần await nếu client không async)
  const supabase = await createClient();

  // 🔍 Truy vấn user theo username
  const { data: user, error } = await supabase
    .from("users")
    .select("username, full_name, bio, avatar_url")
    .eq("username", params.username)
    .single();

  // ❌ Nếu không có user hoặc xảy ra lỗi => trả về trang 404
  if (error || !user) {
    notFound(); // Sử dụng API của Next.js để render 404
  }

  // ✅ Hiển thị hồ sơ người dùng
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        {/* 🖼 Avatar người dùng (dùng <Image /> để tối ưu hiệu suất) */}
        <Image
          src={user.avatar_url || "/default-avatar.png"}
          alt={`Avatar of ${user.username}`}
          width={64}
          height={64}
          className="rounded-full object-cover border"
        />

        {/* 🧑 Tên và username */}
        <div>
          <h1 className="text-2xl font-semibold">@{user.username}</h1>
          {user.full_name && (
            <p className="text-gray-600 dark:text-gray-400">
              {user.full_name}
            </p>
          )}
        </div>
      </div>

      {/* 📄 Tiểu sử (bio) nếu có */}
      {user.bio && (
        <div className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {user.bio}
        </div>
      )}
    </div>
  );
}

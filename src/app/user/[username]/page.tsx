// src/app/users/[username]/page.tsx

// ✅ 1. Import các hàm và thư viện cần thiết
import { createClient } from '@/lib/supabase/server'; // Helper để tạo Supabase client phía server
import { notFound } from 'next/navigation';         // Hàm của Next.js để trả về trang 404
import Image from 'next/image';                       // Component Image tối ưu của Next.js

/*
 * ✅ 2. Định nghĩa kiểu dữ liệu cho props trực tiếp trong tham số hàm.
 * Đây là cách làm chuẩn để tránh lỗi TypeScript với các trang `async`.
 * Nó tường minh và giải quyết triệt để vấn đề xung đột kiểu dữ liệu.
 */
export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  // ✅ 3. Lấy username từ params
  const { username } = params;

  // ✅ 4. Khởi tạo client và fetch dữ liệu
  // `createClient()` được gọi bên trong component để tận dụng caching của Next.js.
  const supabase = await createClient();
  
  // Dùng `await` để chờ kết quả từ database
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, website')
    .eq('username', username)
    .single(); // Dùng .single() vì chúng ta mong đợi chỉ một kết quả

  /*
   * ✅ 5. Xử lý trường hợp không tìm thấy dữ liệu (quan trọng cho UX).
   * Nếu có lỗi từ Supabase hoặc `profile` là null, chuyển hướng sang trang 404.
   */
  if (error || !profile) {
    notFound();
  }

  // ✅ 6. Render giao diện với dữ liệu đã fetch được
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center">
        <Image
          src={profile.avatar_url || '/default-avatar.png'} // Cung cấp ảnh dự phòng
          alt={`Avatar of ${profile.full_name}`}
          width={150}
          height={150}
          priority // Thêm `priority` cho ảnh chính của trang (LCP) để tối ưu tốc độ tải
          className="rounded-full mx-auto mb-4 border-4 border-blue-400"
        />
        <h1 className="text-4xl font-bold">{profile.full_name || 'Anonymous User'}</h1>
        <h2 className="text-2xl text-gray-600 mb-4">@{profile.username}</h2>
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {profile.website}
          </a>
        )}
      </div>
    </div>
  );
}
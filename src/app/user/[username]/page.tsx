// src/app/users/[username]/page.tsx

// Tối ưu: Sử dụng lại type Props đã định nghĩa ở trên.
// Việc lặp lại { params: { username: string } } trong function signature là không cần thiết.
type Props = {
    params: { username: string };
  };
  
  // Tối ưu: Bỏ từ khóa `async` vì component này không thực hiện bất kỳ thao tác bất đồng bộ nào (như fetch data).
  // Next.js sẽ tự động coi đây là một Server Component. Giữ code tinh gọn giúp dễ đọc hơn.
  export default function UserPage({ params }: Props) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        Xin chào @{params.username}
      </div>
    );
  }
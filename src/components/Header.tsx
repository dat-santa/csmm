// src/components/Header.tsx

"use client"; // ✅ Bắt buộc để component chạy trên client-side (vì dùng hooks như useEffect, useState)

// ✅ Import các hook từ React và Next.js
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// ✅ Import hàm tạo Supabase client và kiểu dữ liệu User
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// ✅ Import các component cần thiết từ shadcn/ui đã cài đặt
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import Link from "next/link";

// ✅ Định nghĩa kiểu dữ liệu cho `profile` để đảm bảo code chặt chẽ
// Chúng ta sẽ lấy dữ liệu này từ bảng `profiles` trong DB
type Profile = {
  username: string;
  avatar_url: string;
  full_name: string;
};

// ====================================================================
// =================== BẮT ĐẦU COMPONENT HEADER ======================
// ====================================================================

export default function Header() {
  // ✅ Khởi tạo các hook và client cần thiết bên trong component
  const supabase = createClient();
  const router = useRouter();

  // ✅ State để lưu toàn bộ object người dùng từ Supabase, không chỉ avatar
  const [user, setUser] = useState<User | null>(null);
  // ✅ State để lưu thông tin profile (username, full_name, etc.) từ bảng `profiles`
  const [profile, setProfile] = useState<Profile | null>(null);
  // ✅ State để quản lý trạng thái loading, giúp cải thiện UX
  const [loading, setLoading] = useState(true);

  // ✅ Hàm tiện ích để lấy chữ cái đầu của tên, dùng cho Avatar Fallback
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "??"; // Trả về '??' nếu không có tên
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // ✅ useEffect sẽ chạy một lần khi component được mount để lấy thông tin user
  // và lắng nghe các thay đổi về trạng thái đăng nhập.
  useEffect(() => {
    // Hàm async để lấy dữ liệu ban đầu
    const fetchInitialData = async () => {
      // 1. Lấy thông tin user đang đăng nhập
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user); // Cập nhật state user

        // 2. Dùng user.id để lấy profile tương ứng từ bảng `profiles`
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url, full_name')
          .eq('id', user.id)
          .single(); // .single() để lấy về 1 object duy nhất

        if (profileData) {
          setProfile(profileData); // Cập nhật state profile
        }
      }
      setLoading(false); // Hoàn tất loading
    };

    fetchInitialData();

    // 3. Lắng nghe sự kiện auth (login, logout) để tự động cập nhật UI
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        // Nếu user logout (currentUser là null), reset profile
        if (!currentUser) {
          setProfile(null);
        }
        // Nếu có sự thay đổi (ví dụ user vừa login), fetch lại data
        else if (_event === 'SIGNED_IN') {
           fetchInitialData();
        }
      }
    );

    // ✅ Cleanup: Hủy lắng nghe khi component bị unmount để tránh memory leak
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]); // Dependency là supabase client

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href, // Quay lại đúng trang hiện tại sau khi login
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null); // Xóa profile khỏi state
    router.push('/'); // Điều hướng về trang chủ
  };

  // --- PHẦN RENDER GIAO DIỆN ---

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* ✅ Logo hoặc tên trang web bên trái */}
        <Link href="/" className="text-xl font-bold">CSMM</Link>

        {/* ✅ Phần bên phải: Hiển thị Avatar hoặc nút Login */}
        <div className="flex items-center space-x-2">
          {loading ? (
            // ✅ Khi đang loading, hiển thị một placeholder để UX tốt hơn
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : profile ? (
            // ✅ Nếu đã có profile (đã đăng nhập), hiển thị Dropdown Menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* 
                  - Trigger là component Avatar. 
                  - `asChild` cho phép DropdownMenu "mượn" component con làm trigger
                    thay vì tạo một button mặc định.
                */}
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                    <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{profile.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* 
                  - Dùng `onClick` với `router.push` thay vì thẻ <Link> 
                  - Lý do: Giữ nguyên được style và hành vi (hover, focus) của DropdownMenuItem.
                */}
                <DropdownMenuItem onClick={() => router.push(`/@${profile.username}`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // ✅ Nếu chưa đăng nhập, hiển thị nút Login
            <Button onClick={handleLogin}>Log In</Button>
          )}
        </div>
      </div>
    </header>
  );
}
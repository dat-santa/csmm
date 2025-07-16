'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

// UI components (Shadcn UI)
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
import { Skeleton } from '@/components/ui/skeleton';

// Kiểu dữ liệu cho bảng profiles
type Profile = {
  username: string;
  avatar_url: string;
  full_name: string;
};

export default function Header() {
  const supabase = createClient();
  const router = useRouter();

  // Trạng thái lưu user auth và profile riêng
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading ban đầu

  // 👉 Tạo chữ viết tắt fallback cho avatar nếu không có ảnh
  const getInitials = (name?: string | null): string => {
    if (!name) return "??";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // 👉 Tự động bắt sự kiện thay đổi auth khi đăng nhập/đăng xuất
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);

          // Gọi Supabase để lấy thông tin từ bảng `profiles`
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name')
            .eq('id', session.user.id)
            .single();

          if (!error) {
            setProfile(profileData);
          } else {
            console.error('Error fetching profile:', error.message);
            setProfile(null);
          }
        } else {
          // Không có session → reset state
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Cleanup: hủy listener khi component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  // 👉 Trigger đăng nhập với Google (One Tap hoặc popup)
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  // 👉 Trigger đăng xuất
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo hoặc tên app */}
        <Link href="/" className="font-bold text-lg">MyApp</Link>

        {/* Phần bên phải: avatar hoặc login */}
        <div>
          {loading ? (
            // Đang kiểm tra trạng thái → hiển thị skeleton
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : profile ? (
            // Đã đăng nhập và có thông tin → hiện avatar dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={`@${profile.username}`}
                    />
                    <AvatarFallback>
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{profile.username}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push(`/@${profile.username}`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Không có user → hiện nút Login
            <Button onClick={handleLogin}>Log In</Button>
          )}
        </div>
      </div>
    </header>
  );
}

import { createClient } from "@/lib/supabase/server";

export default async function UserProfile({ params }: { params: { username: string } }) {
  const supabase = await createClient();

  // Truy vấn user theo username
  const { data: user, error } = await supabase
    .from("users")
    .select("username, full_name, bio, avatar_url")
    .eq("username", params.username)
    .single();

  if (error || !user) {
    return <div className="p-4 text-red-500">Người dùng không tồn tại.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">@{user.username}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.full_name}</p>
        </div>
      </div>
      <div className="mt-4 text-gray-800 dark:text-gray-200">{user.bio}</div>
    </div>
  );
}

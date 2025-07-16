import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

// Nếu pathname là dạng /@username → rewrite sang /users/username
  if (pathname.startsWith("/@")) {
    const username = pathname.slice(2); // Bỏ dấu @
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = `/users/${username}`; // Rewrite tới route thật
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

// chỉ áp dụng với username
export const config = {
    matcher: ["/@", "/@:*"], // chỉ áp dụng với URL /@...
  };
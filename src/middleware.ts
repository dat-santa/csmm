// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Logic này đã đúng. Ta có thể thêm một bước kiểm tra để chắc chắn hơn.
  if (pathname.startsWith("/@")) {
    const username = pathname.slice(2); // Bỏ đi 2 ký tự đầu tiên là "/@"

    // Tối ưu: Thêm điều kiện kiểm tra username có tồn tại không.
    // Điều này tránh trường hợp người dùng truy cập vào đường dẫn "/@" (không có username)
    // và rewrite thành "/users/" có thể gây ra lỗi 404.
    if (username) {
      const newUrl = req.nextUrl.clone();
      newUrl.pathname = `/users/${username}`;
      return NextResponse.rewrite(newUrl);
    }
  }

  return NextResponse.next();
}

// Đây là phần quan trọng cần sửa
export const config = {
  /*
   * Lỗi logic: Matcher của bạn ["/@", "/@:username"] có vấn đề:
   * 1. "/@": Chỉ khớp với ĐÚNG đường dẫn "/@", không khớp với "/@user123".
   * 2. "/@:username": Khớp với các đường dẫn như "/@user123".
   * => Cách viết này vừa thừa, vừa không hiệu quả.
   *
   * Cách sửa đúng: Sử dụng một pattern duy nhất với path-to-regexp.
   * "/@:username+": Dấu "+" có nghĩa là "username" phải có MỘT hoặc NHIỀU ký tự.
   * Điều này đảm bảo middleware chỉ chạy cho các đường dẫn như "/@user123", "/@abc"
   * và KHÔNG chạy cho đường dẫn rỗng "/@".
   */
  matcher: "/@:username+",
};
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // 👇 Thêm domain dev mà bạn truy cập
  allowedDevOrigins: ['https://mxh.csmm.vn'],
  
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Cho phép ảnh từ Google OAuth
  },
};

export default nextConfig;

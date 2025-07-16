import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Cho phép ảnh từ Google OAuth
  },
};

export default nextConfig;

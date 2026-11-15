import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "21mb" } },
  serverExternalPackages: [
    "@prisma/adapter-libsql",
    "@libsql/client",
    "@prisma/client",
    "bcryptjs",
    "sharp",
  ],
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;

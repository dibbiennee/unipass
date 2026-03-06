/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, max-age=0" },
      ],
    },
  ],
};

export default nextConfig;

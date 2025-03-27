/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
        "utfs.io"
        ]
    },
    experimental: {
        // runtime: "nodejs",
        middleware: true,
      },
    eslint: {
        ignoreDuringBuilds: true, // Menonaktifkan ESLint saat build
      },
};

export default nextConfig;

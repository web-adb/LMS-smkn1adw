/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
        "utfs.io"
        ]
    },
    eslint: {
        ignoreDuringBuilds: true, // Menonaktifkan ESLint saat build
      },
};

export default nextConfig;

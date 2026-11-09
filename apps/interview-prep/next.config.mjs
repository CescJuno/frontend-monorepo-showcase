/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@monorepo/ui'],
  serverExternalPackages: ['pdf-parse'],
}

export default nextConfig

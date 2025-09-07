/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/**"
      ),
      new URL("https://assets.streamlinehq.com/image/private/**"),
    ],
  },
};

export default nextConfig;

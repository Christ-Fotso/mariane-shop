import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // We might need this if we're serving local files from a volume, or we can use next/image but it's simpler for local volumes
  },
};

export default nextConfig;

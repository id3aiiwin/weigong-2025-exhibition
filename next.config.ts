import type { NextConfig } from "next";

// GitHub Pages 部署時設為 /<repo>，本機開發維持空字串
const repo = "weigong-2025-exhibition";
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;

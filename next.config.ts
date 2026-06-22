import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rule 3: build off-server and ship a self-contained server artifact.
  // The 512MB Lightsail box runs the built output only (next start via PM2).
  output: "standalone",

  // Rule 5: uploaded media is compressed to WebP and served directly by Nginx
  // from /uploads. Heavy on-the-fly Next image optimization is avoided for that
  // media (use plain <img>/<Image unoptimized> against UPLOAD_PUBLIC_URL).
};

export default nextConfig;

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: "export",
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "fluent-ffmpeg",
      "better-sqlite3",
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@prisma/client"] = path.resolve(
      __dirname,
      "electron/prisma-client",
    );
    return config;
  },
};
export default nextConfig;

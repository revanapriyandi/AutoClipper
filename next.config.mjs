import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Electron (no server needed)
  output: "export",

  // ── Minification ────────────────────────────────────────────────
  swcMinify: true,           // SWC minifier (faster + smaller than Terser)
  compress: true,
  poweredByHeader: false,

  // ── Image Optimization (off for static export) ───────────────────
  images: {
    unoptimized: true,
  },

  // ── Compiler Optimizations ───────────────────────────────────────
  compiler: {
    // Remove all console.log in production
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  experimental: {
    // These heavy Node modules stay in the main process — don't bundle them
    serverComponentsExternalPackages: [
      "@prisma/client",
      "fluent-ffmpeg",
      "better-sqlite3",
    ],
    // Optimize package imports — only import what's used from icon libraries
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-progress",
      "@radix-ui/react-slider",
      "@radix-ui/react-tooltip",
    ],
  },

  webpack: (config, { isServer, dev }) => {
    // ── Prisma alias ─────────────────────────────────────────────
    config.resolve.alias["@prisma/client"] = path.resolve(
      __dirname,
      "electron/prisma-client",
    );

    // ── Tree-shake heavy Node packages from renderer bundle ───────
    config.externals = [
      ...(config.externals || []),
      "electron",
      "keytar",
      "better-sqlite3",
      "fluent-ffmpeg",
    ];

    // ── Production-only: split chunks for better caching ─────────
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        // Split vendor chunks by library for efficient caching
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Recharts in its own chunk (large: ~400KB)
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: "recharts",
              chunks: "all",
              priority: 30,
            },
            // Radix UI grouped together
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: "radix",
              chunks: "all",
              priority: 20,
            },
            // Everything else: standard vendors chunk
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;

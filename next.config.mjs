import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'fluent-ffmpeg', 'better-sqlite3'],
  },
  webpack: (config) => {
    config.resolve.alias['@prisma/client'] = path.resolve(__dirname, 'electron/prisma-client');
    return config;
  },
};

export default withNextIntl(nextConfig);

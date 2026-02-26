import { PrismaClient } from '@prisma/client'

// Lazy singleton — only instantiated when first called (inside handler), NOT at module import time.
// This prevents PrismaClient init errors during Next.js build-time page collection.
let _prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient();
  }
  return _prisma;
}

export default getPrisma;

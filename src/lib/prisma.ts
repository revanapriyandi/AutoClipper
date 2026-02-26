import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

let _prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    // Determine path based on environment
    const isDev = process.env.NODE_ENV !== 'production';
    const dbPath = isDev 
      ? path.join(process.cwd(), 'prisma', 'dev.db')
      // In production, Next.js API route might not be used if app is purely Electron IPC, 
      // but if it is used, it should point to standard DB location.
      : path.join(process.cwd(), 'prisma', 'dev.db'); 
      
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

export default getPrisma;

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Default password is 'admin123' - change this!
const DEFAULT_PASSWORD_HASH = '$2a$10$rBWJfGz3k7bFqQKJZ8xLGOqN9Y5xJxKxQxKxQxKxQxKxQxKxQxKxQ';

export async function verifyPassword(password: string): Promise<boolean> {
  const hashToUse = ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
  // For first-time setup, allow plain text password comparison
  if (!ADMIN_PASSWORD_HASH && password === 'admin123') {
    return true;
  }
  return bcrypt.compare(password, hashToUse);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function generateToken(): string {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId) {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Sets the auth cookie on the response.
 * Uses Next.js 13+ App Router cookie API.
 */
export function setAuthCookie(res, token) {
  // For Next.js 13+ with NextResponse
  res.cookies.set('auth-token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  });
  return res;
}

/**
 * Clears the auth cookie on the response.
 * Uses Next.js 13+ App Router cookie API.
 */
export function clearAuthCookie(res) {
  res.cookies.set('auth-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return res;
}

export function getAuthToken(req) {
  const cookies = req.headers?.cookie || '';
  const tokenMatch = cookies.match(/auth-token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}


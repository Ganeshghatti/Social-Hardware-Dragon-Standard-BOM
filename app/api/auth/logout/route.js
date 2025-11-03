import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(req) {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}


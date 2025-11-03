import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { comparePasswords, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/models';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    if (email !== "ganesh@socialhardware.in" || password !== "Ganesh@1234") {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken("ganesh@socialhardware.in");
    const response = NextResponse.json({ success: true, user: { email: "ganesh@socialhardware.in", role: "admin" } });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
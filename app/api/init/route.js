import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET(req) {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}


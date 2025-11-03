import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(req) {
  try {
    const collection = await getCollection('audit_logs');
    const logs = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { qcRecordSchema } from '@/lib/models';

export async function GET(req) {
  try {
    const collection = await getCollection('qc_records');
    const records = await collection.find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching QC records:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const qcData = qcRecordSchema.parse(body);

    const collection = await getCollection('qc_records');
    const result = await collection.insertOne({
      ...qcData,
      date: new Date(),
      created_at: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating QC record:', error);
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


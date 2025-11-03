import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { bomSchema } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const collection = await getCollection('boms');
    const boms = await collection.find({}).toArray();
    return NextResponse.json(boms);
  } catch (error) {
    console.error('Error fetching BOMs:', error);
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
    const bomData = bomSchema.parse(body);

    const collection = await getCollection('boms');
    const result = await collection.insertOne({
      ...bomData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'CREATE',
      collection: 'boms',
      document_id: result.insertedId.toString(),
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating BOM:', error);
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

export async function PATCH(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collection = await getCollection('boms');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'BOM not found' }, { status: 404 });
    }

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'UPDATE',
      collection: 'boms',
      document_id: id,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating BOM:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


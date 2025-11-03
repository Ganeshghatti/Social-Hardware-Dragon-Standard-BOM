import { NextResponse } from 'next/server';
import { getCollection, getDb } from '@/lib/db';
import { partSchema } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET all parts
export async function GET(req) {
  try {
    const collection = await getCollection('parts');
    const parts = await collection.find({}).toArray();
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new part
export async function POST(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const partData = partSchema.parse(body);

    const collection = await getCollection('parts');
    const result = await collection.insertOne({
      ...partData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'CREATE',
      collection: 'parts',
      document_id: result.insertedId.toString(),
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating part:', error);
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

// PATCH update part
export async function PATCH(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collection = await getCollection('parts');
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
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'UPDATE',
      collection: 'parts',
      document_id: id,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating part:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE part
export async function DELETE(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const collection = await getCollection('parts');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'DELETE',
      collection: 'parts',
      document_id: id,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting part:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


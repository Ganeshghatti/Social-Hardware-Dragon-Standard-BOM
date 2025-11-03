import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { workOrderSchema } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const collection = await getCollection('workorders');
    const workOrders = await collection.find({}).toArray();
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
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
    const workOrderData = workOrderSchema.parse(body);

    const collection = await getCollection('workorders');
    const result = await collection.insertOne({
      ...workOrderData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'CREATE',
      collection: 'workorders',
      document_id: result.insertedId.toString(),
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating work order:', error);
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

    const collection = await getCollection('workorders');
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
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'UPDATE',
      collection: 'workorders',
      document_id: id,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


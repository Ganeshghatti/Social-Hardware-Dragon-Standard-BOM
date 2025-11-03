import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { purchaseOrderSchema } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const collection = await getCollection('purchase_orders');
    const pos = await collection.find({}).toArray();
    return NextResponse.json(pos);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
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
    const poData = purchaseOrderSchema.parse(body);

    const collection = await getCollection('purchase_orders');
    const result = await collection.insertOne({
      ...poData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating purchase order:', error);
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

    const collection = await getCollection('purchase_orders');
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
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


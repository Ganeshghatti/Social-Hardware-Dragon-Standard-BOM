import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { part_id, qty_change, reason } = body;

    if (!part_id || qty_change === undefined || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const partsCollection = await getCollection('parts');
    const part = await partsCollection.findOne({ _id: new ObjectId(part_id) });

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    const newQty = part.stock_qty + qty_change;
    if (newQty < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    await partsCollection.updateOne(
      { _id: new ObjectId(part_id) },
      {
        $set: {
          stock_qty: newQty,
          updated_at: new Date(),
        },
      }
    );

    // Record transaction
    const transactionCollection = await getCollection('inventory_transactions');
    await transactionCollection.insertOne({
      part_id,
      qty_change,
      reason,
      date: new Date(),
      user_id: userId,
    });

    // Audit log
    const auditCollection = await getCollection('audit_logs');
    await auditCollection.insertOne({
      user_id: userId,
      action: 'UPDATE',
      collection: 'inventory',
      document_id: part_id,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, new_qty: newQty });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bomId = searchParams.get('bom_id');

    if (!bomId) {
      return NextResponse.json({ error: 'BOM ID required' }, { status: 400 });
    }

    const bomsCollection = await getCollection('boms');
    const bom = await bomsCollection.findOne({ _id: new ObjectId(bomId) });

    if (!bom) {
      return NextResponse.json({ error: 'BOM not found' }, { status: 404 });
    }

    const partsCollection = await getCollection('parts');
    let totalCost = 0;
    const costBreakdown = [];

    for (const item of bom.items) {
      const part = await partsCollection.findOne({
        _id: new ObjectId(item.part_id),
      });
      if (part) {
        const itemCost = part.cost * item.qty;
        totalCost += itemCost;
        costBreakdown.push({
          part_id: item.part_id,
          part_name: part.name,
          quantity: item.qty,
          unit_cost: part.cost,
          total_cost: itemCost,
        });
      }
    }

    return NextResponse.json({
      bom_id: bomId,
      total_cost: totalCost,
      breakdown: costBreakdown,
    });
  } catch (error) {
    console.error('Error calculating BOM cost:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


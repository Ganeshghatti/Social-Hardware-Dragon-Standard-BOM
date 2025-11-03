import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(req) {
  try {
    const collection = await getCollection('parts');
    const parts = await collection.find({}).toArray();

    let totalValue = 0;
    const valuation = parts.map((part) => {
      const itemValue = part.cost * part.stock_qty;
      totalValue += itemValue;
      return {
        part_id: part._id,
        item_code: part.item_code,
        name: part.name,
        stock_qty: part.stock_qty,
        unit_cost: part.cost,
        total_value: itemValue,
      };
    });

    return NextResponse.json({
      total_value: totalValue,
      items: valuation,
    });
  } catch (error) {
    console.error('Error calculating inventory valuation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


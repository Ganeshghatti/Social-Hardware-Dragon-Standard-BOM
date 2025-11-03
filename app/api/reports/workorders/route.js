import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(req) {
  try {
    const collection = await getCollection('workorders');
    const workOrders = await collection.find({}).toArray();

    const summary = {
      total: workOrders.length,
      planned: 0,
      in_progress: 0,
      completed: 0,
      orders: workOrders,
    };

    workOrders.forEach((wo) => {
      if (wo.status === 'Planned') summary.planned++;
      else if (wo.status === 'In Progress') summary.in_progress++;
      else if (wo.status === 'Completed') summary.completed++;
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching work order summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


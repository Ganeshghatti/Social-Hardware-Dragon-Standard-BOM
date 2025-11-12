import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

const EXISTING_ADMIN_EMAIL = 'ganesh@socialhardware.in';
const NEW_ADMIN_EMAIL = 'ganesh@socialhardware.in';
const NEW_ADMIN_PASSWORD = 'Ganesh@1234';

export async function GET() {
  try {
    const db = await getDb();
    const usersCollection = await db.collection('users');

    const existingAdmin = await usersCollection.findOne({
      email: EXISTING_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        adminExists: true,
        message: `Admin with email ${EXISTING_ADMIN_EMAIL} already exists.`,
      });
    }

    const passwordHash = await hashPassword(NEW_ADMIN_PASSWORD);
    const insertResult = await usersCollection.insertOne({
      email: NEW_ADMIN_EMAIL,
      password_hash: passwordHash,
      role: 'admin',
      last_login: null,
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      adminExists: false,
      createdAdminId: insertResult.insertedId,
      message: `Admin user created with email ${NEW_ADMIN_EMAIL}.`,
    });
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ensure admin user.' },
      { status: 500 }
    );
  }
}



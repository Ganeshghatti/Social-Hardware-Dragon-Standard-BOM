import { getDb } from './db';
import { hashPassword } from './auth';

export async function initializeDatabase() {
  try {
    const db = await getDb();

    // Check if admin user exists
    const usersCollection = await db.collection('users');
    const existingAdmin = await usersCollection.findOne({
      email: process.env.ADMIN_EMAIL || 'admin@roboticarm.com',
    });

    if (!existingAdmin) {
      // Create default admin user
      const hashedPassword = await hashPassword(
        process.env.ADMIN_PASSWORD || 'admin123456'
      );
      await usersCollection.insertOne({
        email: process.env.ADMIN_EMAIL || 'admin@roboticarm.com',
        password_hash: hashedPassword,
        role: 'admin',
        last_login: null,
        created_at: new Date(),
      });
      console.log('✓ Default admin user created');
    }

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}


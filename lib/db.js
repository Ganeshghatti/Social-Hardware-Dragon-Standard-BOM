import clientPromise from './mongodb';

const dbName = 'robotic_arm_dashboard';

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper to get collections
export async function getCollection(collectionName) {
  const db = await getDb();
  return db.collection(collectionName);
}


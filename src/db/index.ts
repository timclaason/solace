import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export const setup = () => {
  if (dbInstance) {
    return dbInstance;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Please configure your environment variables.'
    );
  }

  try {
    const queryClient = postgres(process.env.DATABASE_URL);
    dbInstance = drizzle(queryClient);
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Export the initialized db instance
export const db = setup();

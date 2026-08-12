import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime: number | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastFailureTime: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Don't re-attempt failed MongoDB connection for 30 seconds to keep page transitions instant
const FAILURE_COOLDOWN_MS = 30000;

export async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If DB connection recently failed, throw immediately without waiting 30s timeout
  if (
    cached.lastFailureTime &&
    Date.now() - cached.lastFailureTime < FAILURE_COOLDOWN_MS
  ) {
    throw new Error("MongoDB server connection skipped due to recent timeout.");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500, // Fast 1.5s timeout instead of 30,000ms default delay
      connectTimeoutMS: 1500,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      cached.lastFailureTime = null;
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailureTime = Date.now();
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

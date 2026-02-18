import _mongoose from 'mongoose';

declare global {
  var mongooseCacheGlobal: { conn: any; promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseCacheGlobal;

if (!cached) {
  cached = global.mongooseCacheGlobal = { conn: null, promise: null };
}

const mongooseCache = cached;

async function connectToDatabase() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = _mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}

export default connectToDatabase;

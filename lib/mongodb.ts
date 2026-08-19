import mongoose, { type Mongoose } from "mongoose"

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // Keep the cache across module reloads triggered by Next.js development mode.
  var mongooseCache: MongooseCache | undefined
}

const cached = globalThis.mongooseCache ?? (globalThis.mongooseCache = {
  conn: null,
  promise: null,
})

/**
 * Connect to MongoDB once and reuse the connection for future requests.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  const mongodbUri = process.env.MONGODB_URI

  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable.")
  }

  // Share an in-flight connection attempt so concurrent requests do not open extras.
  cached.promise ??= mongoose.connect(mongodbUri)

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    // Allow a later request to retry if the initial connection fails.
    cached.promise = null
    throw error
  }
}

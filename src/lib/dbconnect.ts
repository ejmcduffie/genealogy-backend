// src/lib/dbConnect.ts
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Create connection options with MongoDB Atlas recommended settings
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    };

    // Use the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    // Log connection details for debugging (masking any credentials)
    const sanitizedUri = uri.replace(/(mongodb:\/\/|mongodb\+srv:\/\/)[^@]+@/, '$1****:****@');
    console.log(`Connecting to MongoDB Atlas: ${sanitizedUri}`);
    
    // Connect to MongoDB Atlas
    cached.promise = mongoose.connect(uri, opts)
      .then(mongoose => {
        console.log('Connected successfully to MongoDB Atlas');
        return mongoose;
      })
      .catch(error => {
        console.error('MongoDB Atlas connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}
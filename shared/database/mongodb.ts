import mongoose from 'mongoose';
import { createLogger } from '../utils/logger';

const logger = createLogger('MongoDB');

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;
  private connectionOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    // Handle process termination
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(uri: string = process.env.MONGODB_URI!): Promise<void> {
    if (this.isConnected) {
      logger.info('Using existing MongoDB connection');
      return;
    }

    try {
      await mongoose.connect(uri, this.connectionOptions);
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Received termination signal, shutting down MongoDB connection');
    try {
      await this.disconnect();
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}


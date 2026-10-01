import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

class DatabaseManager {
  private isConnected = false;

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        user: env.MONGODB_USER || undefined,
        pass: env.MONGODB_PASSWORD || undefined
      });
      this.isConnected = true;
    } catch (error) {
      logger.warn(
        { error },
        'MongoDB connection failed. Continuing in offline/mock mode for local dev if DB is unreached.'
      );
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected cleanly');
    }
  }

  public async checkHealth(): Promise<{ status: 'healthy' | 'unhealthy'; responseTimeMs?: number; message?: string }> {
    if (!this.isConnected || mongoose.connection.readyState !== 1) {
      return { status: 'unhealthy', message: 'Not connected to MongoDB' };
    }

    const start = Date.now();
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        return {
          status: 'healthy',
          responseTimeMs: Date.now() - start
        };
      }
      return { status: 'unhealthy', message: 'No active MongoDB database instance' };
    } catch (err: unknown) {
      return {
        status: 'unhealthy',
        message: err instanceof Error ? err.message : 'Ping failed'
      };
    }
  }

  public get readyState(): number {
    return mongoose.connection.readyState;
  }
}

export const databaseManager = new DatabaseManager();

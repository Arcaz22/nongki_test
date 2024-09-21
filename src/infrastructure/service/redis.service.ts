import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: Redis;

    onModuleInit() {
        const redisOptions: RedisOptions = {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
    };

    if (process.env.REDIS_PASSWORD) {
        redisOptions.password = process.env.REDIS_PASSWORD;
    }

        this.redisClient = new Redis(redisOptions);
    }

    async set(key: string, value: string, ttl?: number) {
        if (ttl && ttl > 0) {
            await this.redisClient.set(key, value, 'EX', ttl);
        } else {
            await this.redisClient.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            const value = await this.redisClient.get(key);
            return value;
        } catch (error) {
            return null;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redisClient.del(key);
        } catch (error) {
            console.error('Error deleting Redis key:', error);
        }
    }

    onModuleDestroy() {
        this.redisClient.disconnect();
    }
}

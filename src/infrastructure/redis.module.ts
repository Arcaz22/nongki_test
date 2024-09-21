import {  Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './service/redis.service';

@Module({
    providers: [RedisService],
    exports: [RedisService],
  })
export class RedisConfigModule {}

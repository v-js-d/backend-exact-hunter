import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({ providers: [RedisService], exports: [RedisService] })
@Global()
export class RedisModule {}

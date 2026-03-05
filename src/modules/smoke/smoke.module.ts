import { Module } from '@nestjs/common';
import { SmokeController } from './smoke.conroller';

@Module({
	controllers: [SmokeController],
})
export class SmokeModule {}

import { Module } from '@nestjs/common';
import { SmokeController } from './controllers/smoke.conroller';
import { SmokeService } from './services/smoke.service';

@Module({
	controllers: [SmokeController],
	providers: [SmokeService],
})
export class SmokeModule {}

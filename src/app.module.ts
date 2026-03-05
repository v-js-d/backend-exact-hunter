import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from '@/modules/test/test.module';
import { SmokeModule } from '@/modules/smoke/smoke.module';

@Module({
	imports: [TestModule, SmokeModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

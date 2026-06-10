import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma.service';

@Module({ providers: [PrismaService], exports: [PrismaService], imports: [ConfigModule] })
@Global()
export class PrismaModule {}

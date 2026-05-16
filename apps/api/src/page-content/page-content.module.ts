import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PageContentController } from './page-content.controller';
import { PageContentService } from './page-content.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [PageContentController],
  providers: [PageContentService],
  exports: [PageContentService],
})
export class PageContentModule {}
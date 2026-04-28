import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { DonationsModule } from './donations/donations.module';
import { DonorsModule } from './donors/donors.module';
import { PrismaModule } from './prisma.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    DonorsModule,
    DonationsModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

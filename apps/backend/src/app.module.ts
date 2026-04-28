import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonationsModule } from './donations/donations.module';
import { DonorsModule } from './donors/donors.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, DonorsModule, DonationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

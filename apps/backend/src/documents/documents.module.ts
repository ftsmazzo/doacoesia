import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DonorDocumentsController } from './donor-documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController, DonorDocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}

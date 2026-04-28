import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('donations')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('id') donationId: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.uploadForDonation(donationId, file);
  }

  @Get(':id/documents')
  listByDonation(@Param('id') donationId: string) {
    return this.documentsService.listByDonation(donationId);
  }

  @Get('documents/:documentId/access-url')
  getAccessUrl(@Param('documentId') documentId: string) {
    return this.documentsService.getAccessUrl(documentId);
  }
}

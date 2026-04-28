import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DonorDocumentType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('donors')
export class DonorDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  private parseType(type: string): DonorDocumentType {
    if (
      type === 'FICHA_INSCRICAO_ANEXO_I' ||
      type === 'DOCUMENTO_IDENTIFICACAO'
    ) {
      return type;
    }
    throw new BadRequestException('Tipo de documento do doador invalido.');
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('id') donorId: string,
    @Query('type') type: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!type) {
      throw new BadRequestException('Parametro type e obrigatorio.');
    }
    return this.documentsService.uploadForDonor(
      donorId,
      this.parseType(type),
      file,
    );
  }

  @Get(':id/documents')
  listByDonor(@Param('id') donorId: string) {
    return this.documentsService.listByDonor(donorId);
  }

  @Get(':id/documents/checklist')
  checklist(@Param('id') donorId: string) {
    return this.documentsService.donorChecklist(donorId);
  }
}

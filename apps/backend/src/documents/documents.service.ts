import {
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { MinioService } from '../storage/minio.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DocumentsService {
  private readonly maxFileSizeBytes = 15 * 1024 * 1024;

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async uploadForDonation(donationId: string, file: Express.Multer.File) {
    await this.ensureDonationExists(donationId);
    this.validateFile(file);

    const objectKey = this.buildObjectKey(donationId, file.originalname);
    await this.minio.putObject(
      objectKey,
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    return this.prisma.donationDocument.create({
      data: {
        donationId,
        fileName: file.originalname,
        contentType: file.mimetype,
        sizeBytes: file.size,
        objectKey,
      },
    });
  }

  listByDonation(donationId: string) {
    return this.prisma.donationDocument.findMany({
      where: { donationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAccessUrl(documentId: string) {
    const document = await this.prisma.donationDocument.findUnique({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Documento nao encontrado.');
    }

    const url = await this.minio.getPresignedGetUrl(document.objectKey);
    return {
      id: document.id,
      fileName: document.fileName,
      url,
      expiresInSeconds: 900,
    };
  }

  private async ensureDonationExists(donationId: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      select: { id: true },
    });
    if (!donation) {
      throw new NotFoundException('Doacao nao encontrada.');
    }
  }

  private validateFile(file?: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('Arquivo nao enviado.');
    }
    if (file.size > this.maxFileSizeBytes) {
      throw new PayloadTooLargeException(
        `Arquivo excede limite de ${this.maxFileSizeBytes / (1024 * 1024)}MB.`,
      );
    }
  }

  private buildObjectKey(donationId: string, fileName: string) {
    const safeName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-');

    return `donations/${donationId}/${Date.now()}-${safeName}`;
  }
}

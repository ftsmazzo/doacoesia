import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { DonorDocumentType } from '@prisma/client';
import { MinioService } from '../storage/minio.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DocumentsService {
  private readonly maxFileSizeBytes = 15 * 1024 * 1024;
  private readonly requiredDonorTypes: DonorDocumentType[] = [
    'FICHA_INSCRICAO_ANEXO_I',
    'DOCUMENTO_IDENTIFICACAO',
  ];

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

    return this.prisma.donationDocument.upsert({
      where: {
        donationId_documentType: {
          donationId,
          documentType: 'PROPOSTA_DETALHADA',
        },
      },
      create: {
        donationId,
        fileName: file.originalname,
        documentType: 'PROPOSTA_DETALHADA',
        contentType: file.mimetype,
        sizeBytes: file.size,
        objectKey,
      },
      update: {
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

  async uploadForDonor(
    donorId: string,
    type: DonorDocumentType,
    file: Express.Multer.File,
  ) {
    await this.ensureDonorExists(donorId);
    this.validateFile(file);

    if (!this.requiredDonorTypes.includes(type)) {
      throw new BadRequestException('Tipo de documento do doador invalido.');
    }

    const objectKey = this.buildObjectKey(
      `donors/${donorId}`,
      file.originalname,
    );
    await this.minio.putObject(
      objectKey,
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    return this.prisma.donorDocument.upsert({
      where: {
        donorId_documentType: {
          donorId,
          documentType: type,
        },
      },
      create: {
        donorId,
        fileName: file.originalname,
        documentType: type,
        contentType: file.mimetype,
        sizeBytes: file.size,
        objectKey,
      },
      update: {
        fileName: file.originalname,
        contentType: file.mimetype,
        sizeBytes: file.size,
        objectKey,
      },
    });
  }

  listByDonor(donorId: string) {
    return this.prisma.donorDocument.findMany({
      where: { donorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async donorChecklist(donorId: string) {
    await this.ensureDonorExists(donorId);
    const docs = await this.prisma.donorDocument.findMany({
      where: { donorId },
      select: { documentType: true },
    });
    const uploadedTypes = new Set(docs.map((d) => d.documentType));
    return {
      donorId,
      required: this.requiredDonorTypes,
      uploaded: [...uploadedTypes],
      pending: this.requiredDonorTypes.filter(
        (type) => !uploadedTypes.has(type),
      ),
      completed: this.requiredDonorTypes.every((type) =>
        uploadedTypes.has(type),
      ),
    };
  }

  async getAccessUrl(documentId: string) {
    const document =
      (await this.prisma.donationDocument.findUnique({
        where: { id: documentId },
      })) ??
      (await this.prisma.donorDocument.findUnique({
        where: { id: documentId },
      }));
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

  private async ensureDonorExists(donorId: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { id: donorId },
      select: { id: true },
    });
    if (!donor) {
      throw new NotFoundException('Doador nao encontrado.');
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

  private buildObjectKey(prefix: string, fileName: string) {
    const safeName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-');

    return `${prefix}/${Date.now()}-${safeName}`;
  }
}

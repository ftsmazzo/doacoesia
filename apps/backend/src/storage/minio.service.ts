import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket = process.env.MINIO_BUCKET ?? 'doacoes';
  private readonly client: Client;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT;
    const port = Number(process.env.MINIO_PORT ?? 9000);
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;

    if (!endpoint || !accessKey || !secretKey) {
      throw new Error(
        'Variaveis MINIO_ENDPOINT, MINIO_ACCESS_KEY e MINIO_SECRET_KEY sao obrigatorias.',
      );
    }

    this.client = new Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    await this.ensureBucket();
  }

  async putObject(
    objectKey: string,
    buffer: Buffer,
    contentType: string,
    fileName: string,
  ) {
    await this.client.putObject(this.bucket, objectKey, buffer, buffer.length, {
      'Content-Type': contentType,
      'X-Amz-Meta-Original-File-Name': fileName,
    });
  }

  async getPresignedGetUrl(objectKey: string, expiresInSeconds = 900) {
    return this.client.presignedGetObject(
      this.bucket,
      objectKey,
      expiresInSeconds,
    );
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      const region = process.env.MINIO_REGION ?? 'us-east-1';
      await this.client.makeBucket(this.bucket, region);
      this.logger.log(`Bucket ${this.bucket} criado automaticamente.`);
    }
  }
}

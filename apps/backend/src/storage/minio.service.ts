import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket = process.env.MINIO_BUCKET ?? 'doacoes';
  private readonly client: Client;
  private isAvailable = false;

  constructor() {
    const serverUrl = process.env.MINIO_SERVER_URL;
    const accessKey = process.env.MINIO_ROOT_USER;
    const secretKey = process.env.MINIO_ROOT_PASSWORD;

    if (!serverUrl || !accessKey || !secretKey) {
      throw new Error(
        'Variaveis MINIO_SERVER_URL, MINIO_ROOT_USER e MINIO_ROOT_PASSWORD sao obrigatorias.',
      );
    }

    const normalized = this.normalizeEndpoint(serverUrl);

    this.client = new Client({
      endPoint: normalized.endPoint,
      port: normalized.port,
      useSSL: normalized.useSSL,
      pathStyle: true,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    try {
      await this.ensureBucket();
      this.isAvailable = true;
      this.logger.log('MinIO conectado com sucesso.');
    } catch (error) {
      this.isAvailable = false;
      this.logger.error(
        'MinIO indisponivel no startup. A API seguira ativa, mas endpoints de documentos retornarao erro ate o ajuste de configuracao.',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async putObject(
    objectKey: string,
    buffer: Buffer,
    contentType: string,
    fileName: string,
  ) {
    this.assertAvailable();
    await this.client.putObject(this.bucket, objectKey, buffer, buffer.length, {
      'Content-Type': contentType,
      'X-Amz-Meta-Original-File-Name': fileName,
    });
  }

  async getPresignedGetUrl(objectKey: string, expiresInSeconds = 900) {
    this.assertAvailable();
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

  private normalizeEndpoint(serverUrl: string) {
    const normalizedInput =
      serverUrl.startsWith('http://') || serverUrl.startsWith('https://')
        ? serverUrl
        : `http://${serverUrl}`;
    const parsed = new URL(normalizedInput);
    return {
      endPoint: parsed.hostname,
      port: parsed.port
        ? Number(parsed.port)
        : parsed.protocol === 'https:'
          ? 443
          : 9000,
      useSSL: parsed.protocol === 'https:',
    };
  }

  private assertAvailable() {
    if (!this.isAvailable) {
      throw new ServiceUnavailableException(
        'Armazenamento de documentos temporariamente indisponivel. Verifique configuracao do MinIO.',
      );
    }
  }
}

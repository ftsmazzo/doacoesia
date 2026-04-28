import { Injectable } from '@nestjs/common';

export type HealthResponse = {
  service: string;
  status: 'ok';
  timestamp: string;
};

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      service: 'doacoesia-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

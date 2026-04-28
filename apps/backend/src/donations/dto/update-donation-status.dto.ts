import { DonationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateDonationStatusDto {
  @IsEnum(DonationStatus)
  status: DonationStatus;
}

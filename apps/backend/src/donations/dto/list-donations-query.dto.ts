import { DonationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ListDonationsQueryDto {
  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  targetAxis?: string;
}

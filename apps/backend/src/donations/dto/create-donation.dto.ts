import { DonationStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDonationDto {
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @IsString()
  @MaxLength(140)
  title: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsString()
  @MaxLength(80)
  targetAxis: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  proposedQuantity?: number;

  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;
}

import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const donorTypes = ['PF', 'PJ'] as const;

export class CreateDonorDto {
  @IsString()
  @IsIn(donorTypes)
  donorType: (typeof donorTypes)[number];

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(11)
  @MaxLength(20)
  document: string;

  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Donor } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';

@Injectable()
export class DonorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDonorDto): Promise<Donor> {
    try {
      return await this.prisma.donor.create({ data: dto });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Ja existe um doador com este documento.');
      }
      throw error;
    }
  }

  findAll(): Promise<Donor[]> {
    return this.prisma.donor.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Donor> {
    const donor = await this.prisma.donor.findUnique({ where: { id } });
    if (!donor) {
      throw new NotFoundException('Doador nao encontrado.');
    }
    return donor;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      typeof error.code !== 'string'
    ) {
      return false;
    }
    return error.code === 'P2002';
  }
}

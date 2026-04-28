import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { ListDonationsQueryDto } from './dto/list-donations-query.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';

type DonationWithDonor = Prisma.DonationGetPayload<{
  include: { donor: true };
}>;

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDonationDto): Promise<DonationWithDonor> {
    return this.prisma.donation.create({
      data: dto,
      include: { donor: true },
    });
  }

  findAll(query: ListDonationsQueryDto): Promise<DonationWithDonor[]> {
    return this.prisma.donation.findMany({
      where: {
        status: query.status,
        targetAxis: query.targetAxis,
      },
      include: { donor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<DonationWithDonor> {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: { donor: true },
    });

    if (!donation) {
      throw new NotFoundException('Doacao nao encontrada.');
    }

    return donation;
  }

  async updateStatus(
    id: string,
    dto: UpdateDonationStatusDto,
  ): Promise<DonationWithDonor> {
    await this.findOne(id);
    return this.prisma.donation.update({
      where: { id },
      data: { status: dto.status },
      include: { donor: true },
    });
  }
}

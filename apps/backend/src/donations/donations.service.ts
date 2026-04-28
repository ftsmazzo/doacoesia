import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { ListDonationsQueryDto } from './dto/list-donations-query.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';

type DonationWithDonor = Prisma.DonationGetPayload<{
  include: { donor: true };
}>;
type DonationListResponse = {
  data: DonationWithDonor[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDonationDto): Promise<DonationWithDonor> {
    return this.prisma.donation.create({
      data: dto,
      include: { donor: true },
    });
  }

  async findAll(query: ListDonationsQueryDto): Promise<DonationListResponse> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where: Prisma.DonationWhereInput = {
      status: query.status,
      targetAxis: query.targetAxis,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.donation.count({ where }),
      this.prisma.donation.findMany({
        where,
        include: { donor: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
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

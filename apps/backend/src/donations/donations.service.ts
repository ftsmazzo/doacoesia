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
type DashboardStatusSummary = {
  received: number;
  underReview: number;
  approved: number;
  rejected: number;
};
type AxisDashboardSummaryRow = {
  axis: string;
  received: number;
  underReview: number;
  approved: number;
  rejected: number;
};
type DonationsDashboardSummary = {
  status: DashboardStatusSummary;
  axis: AxisDashboardSummaryRow[];
};

const dashboardAxis = [
  'Crianças e Adolescentes',
  'Pessoa Idosa',
  'Pessoas com Deficiência',
  'Pessoas em Situação de Rua',
  'Mulheres em Situação de Violência',
  'Jovens em processo de saída das ruas',
  'Calamidade Pública e Emergências',
] as const;

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDonationDto): Promise<DonationWithDonor> {
    return this.prisma.donation.create({
      data: dto,
      include: { donor: true },
    });
  }

  async getDashboardSummary(): Promise<DonationsDashboardSummary> {
    const [received, underReview, approved, rejected, axisStatusRows] =
      await this.prisma.$transaction([
        this.prisma.donation.count({
          where: { status: { not: 'DRAFT' } },
        }),
        this.prisma.donation.count({
          where: { status: 'UNDER_REVIEW' },
        }),
        this.prisma.donation.count({
          where: { status: 'APPROVED' },
        }),
        this.prisma.donation.count({
          where: { status: 'REJECTED' },
        }),
        this.prisma.donation.findMany({
          select: {
            targetAxis: true,
            status: true,
          },
          where: {
            targetAxis: { in: [...dashboardAxis] },
          },
        }),
      ]);

    const axisMap = new Map<string, AxisDashboardSummaryRow>(
      dashboardAxis.map((axis) => [
        axis,
        {
          axis,
          received: 0,
          underReview: 0,
          approved: 0,
          rejected: 0,
        },
      ]),
    );

    for (const row of axisStatusRows) {
      const line = axisMap.get(row.targetAxis);
      if (!line) continue;

      const count = 1;
      if (row.status !== 'DRAFT') {
        line.received += count;
      }
      if (row.status === 'UNDER_REVIEW') {
        line.underReview += count;
      }
      if (row.status === 'APPROVED') {
        line.approved += count;
      }
      if (row.status === 'REJECTED') {
        line.rejected += count;
      }
    }

    return {
      status: {
        received,
        underReview,
        approved,
        rejected,
      },
      axis: [...axisMap.values()],
    };
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

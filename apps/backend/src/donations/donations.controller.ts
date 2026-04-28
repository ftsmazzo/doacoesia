import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDonationDto } from './dto/create-donation.dto';
import { ListDonationsQueryDto } from './dto/list-donations-query.dto';
import { UpdateDonationStatusDto } from './dto/update-donation-status.dto';
import { DonationsService } from './donations.service';

type DonationWithDonor = Prisma.DonationGetPayload<{
  include: { donor: true };
}>;

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() dto: CreateDonationDto): Promise<DonationWithDonor> {
    return this.donationsService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListDonationsQueryDto): Promise<DonationWithDonor[]> {
    return this.donationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DonationWithDonor> {
    return this.donationsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDonationStatusDto,
  ): Promise<DonationWithDonor> {
    return this.donationsService.updateStatus(id, dto);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Donor } from '@prisma/client';
import { CreateDonorDto } from './dto/create-donor.dto';
import { DonorsService } from './donors.service';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()
  create(@Body() dto: CreateDonorDto): Promise<Donor> {
    return this.donorsService.create(dto);
  }

  @Get()
  findAll(): Promise<Donor[]> {
    return this.donorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Donor> {
    return this.donorsService.findOne(id);
  }
}

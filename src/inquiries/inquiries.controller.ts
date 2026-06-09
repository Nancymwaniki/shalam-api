import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InquiriesService } from './inquiries.service';
import type { CreateInquiryDto } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}

  // Public — contact form submissions
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  // Admin only
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.inquiriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.inquiriesService.markRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

export interface CreateInquiryDto {
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId?: string;
}

@Injectable()
export class InquiriesService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  findAll() {
    return this.prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({ data: dto });
    // Fire and forget — don't block the response
    this.mail.sendInquiryNotification(dto);
    return inquiry;
  }

  async markRead(id: string) {
    await this.findOne(id);
    return this.prisma.inquiry.update({ where: { id }, data: { read: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inquiry.delete({ where: { id } });
  }

  private async findOne(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }
}

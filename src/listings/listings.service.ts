import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';

type Category = $Enums.Category;

export interface CreateListingDto {
  title: string;
  category: Category;
  price: number;
  location: string;
  description: string;
  images?: string[];
  featured?: boolean;
  size?: string;
  houseSize?: string;
  bedrooms?: number;
  bathrooms?: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: string;
}

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: Category, featured?: boolean) {
    return this.prisma.listing.findMany({
      where: {
        ...(category && { category }),
        ...(featured !== undefined && { featured }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  create(dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: { ...dto, images: dto.images ?? [] },
    });
  }

  async update(id: string, dto: Partial<CreateListingDto>) {
    await this.findOne(id);
    return this.prisma.listing.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.listing.delete({ where: { id } });
  }
}

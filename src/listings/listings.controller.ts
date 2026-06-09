import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Category } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListingsService } from './listings.service';
import type { CreateListingDto } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  // Public — used by the frontend listing pages
  @Get()
  findAll(
    @Query('category') category?: Category,
    @Query('featured') featured?: string,
  ) {
    const featuredBool =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    return this.listingsService.findAll(category, featuredBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  // Admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateListingDto>) {
    return this.listingsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}

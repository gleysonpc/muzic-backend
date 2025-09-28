import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pages')
export class PagesController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  async findAll() {
    try {
      const pages = await this.pageService.findAll();
      return pages;
    } catch (error) {
      console.error('Error finding pages:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const page = await this.pageService.findOne({ id });
      return page;
    } catch (error) {
      console.error('Error finding page:', error);
      throw error;
    }
  }
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    try {
      const page = await this.pageService.findBySlug(slug);
      return page;
    } catch (error) {
      console.error('Error finding page:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPageDto: CreatePageDto) {
    try {
      const page = await this.pageService.create(createPageDto);
      return page;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }
}

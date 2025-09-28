import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Page } from './page.interface';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all pages' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Page by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const page = await this.pageService.findOne({ id });
      if (!page) {
        throw new NotFoundException();
      }
      return page;
    } catch (error) {
      console.error('Error finding page:', error);
      throw error;
    }
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get Page by slug' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async findBySlug(@Param('slug') slug: string) {
    try {
      const page = await this.pageService.findBySlug(slug);
      if (!page) {
        throw new NotFoundException();
      }
      const result: Partial<Page> = page;
      delete result.userId;

      return result;
    } catch (error) {
      console.error('Error finding page:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Page' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Page created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

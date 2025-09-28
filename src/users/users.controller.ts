import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import type { User } from './user.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOneById({ id });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
}

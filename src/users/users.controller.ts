import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users;
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOneById({ id });
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

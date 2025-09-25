import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: `User ${id}` };
  }
}

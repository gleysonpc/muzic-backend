import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { PageSchema } from './page.schema';
import { PageService } from './page.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Page',
        schema: PageSchema,
        options: {
          tableName: process.env.MUZIC_PAGES_TABLE,
          create: false, // Don't try to create the table
          waitForActive: false, // Don't wait for table to be active
        },
      },
    ]),
  ],
  providers: [PageService],
  controllers: [PagesController],
})
export class PagesModule {}

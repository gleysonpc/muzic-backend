import { Page, PageKey } from './page.interface';
import { PageRepository } from './page.repository';
import { InjectModel, type Model } from 'nestjs-dynamoose';
import * as crypto from 'crypto';

export class PageDynamoDBRepository implements PageRepository<Page> {
  constructor(
    @InjectModel('Page')
    private pageModel: Model<Page, PageKey>,
  ) {}

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  async create(page: Omit<Page, 'id' | 'createdAt'>): Promise<Page> {
    try {
      const newPage = { id: this.generateUUID(), ...page };
      const result = await this.pageModel.create(newPage);
      return result;
    } catch (error) {
      console.error('Error creating page', error);
      throw error;
    }
  }

  async update(key: PageKey, page: Partial<Page>): Promise<Page> {
    try {
      const result = await this.pageModel.update(key, page);
      return result;
    } catch (error) {
      console.error('Error updating page', error);
      throw error;
    }
  }

  async findOne(key: PageKey): Promise<Page | null> {
    try {
      const result = await this.pageModel.get(key);
      return result;
    } catch (error) {
      console.error('Error finding page', error);
      throw error;
    }
  }

  async findAll(): Promise<Page[]> {
    try {
      const result = await this.pageModel.scan().exec();
      return result;
    } catch (error) {
      console.error('Error scanning pages', error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Page | null> {
    try {
      const result = await this.pageModel
        .query('slug')
        .eq(slug)
        .using('pageBySlug')
        .exec();

      if (result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error finding page by slug:', error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel, type Model } from 'nestjs-dynamoose';
import { Page, PageKey } from './page.interface';
import * as crypto from 'crypto';

@Injectable()
export class PageService {
  constructor(
    @InjectModel('Page')
    private pageModel: Model<Page, PageKey>,
  ) {}

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  async create(page: Omit<Page, 'id'>) {
    try {
      const newPage = { id: this.generateUUID(), ...page };
      const result = await this.pageModel.create(newPage);
      return result;
    } catch (error) {
      console.error('Error creating page', error);
      throw error;
    }
  }

  async update(key: PageKey, page: Partial<Page>) {
    try {
      const result = await this.pageModel.update(key, page);
      return result;
    } catch (error) {
      console.error('Error updating page', error);
      throw error;
    }
  }

  async findOne(key: PageKey) {
    try {
      const result = await this.pageModel.get(key);
      return result;
    } catch (error) {
      console.error('Error finding page', error);
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      console.log('Finding pages with slug:', slug);
      const result = await this.pageModel.scan('slug').eq(slug).exec();
      if (result.length) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error finding page by slug', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const result = await this.pageModel.scan().exec();
      return result;
    } catch (error) {
      console.error('Error scanning pages', error);
      throw error;
    }
  }
}

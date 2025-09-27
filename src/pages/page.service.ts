import { Injectable } from '@nestjs/common';
import { Page, PageKey } from './page.interface';
import { PageRepository } from './page.repository';

@Injectable()
export class PageService {
  constructor(private pageRepository: PageRepository<Page>) {}

  async create(page: Omit<Page, 'id'>) {
    return this.pageRepository.create(page);
  }

  async update(key: PageKey, page: Partial<Page>) {
    return this.pageRepository.update(key, page);
  }

  async findOne(key: PageKey) {
    return this.pageRepository.findOne(key);
  }

  async findBySlug(slug: string) {
    return this.pageRepository.findBySlug(slug);
  }

  async findAll() {
    return this.pageRepository.findAll();
  }
}

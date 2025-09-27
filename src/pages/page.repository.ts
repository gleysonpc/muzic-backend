import { PageKey } from './page.interface';

export abstract class PageRepository<T> {
  abstract create(page: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  abstract update(key: PageKey, page: Partial<T>): Promise<T>;
  abstract findOne(key: PageKey): Promise<T | null>;
  abstract findBySlug(slug: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
}

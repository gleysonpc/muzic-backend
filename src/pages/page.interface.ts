export interface PageKey {
  id: string;
}

export interface Page extends PageKey {
  slug: string;
  userId: string;
}

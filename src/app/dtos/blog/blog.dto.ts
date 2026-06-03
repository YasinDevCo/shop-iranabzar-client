export interface BlogDto {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogRequestDto {
  title: string;
  summary: string;
  content: string;
  image?: string;
  author: string;
  tags?: string;
  status?: 'draft' | 'published';
  slug?: string;  // اضافه شد
}

export interface BlogsPaginatedResponse {
  blogs: BlogDto[];
  total: number;
  page: number;
  pages: number;
}

export interface BlogStatsDto {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
}

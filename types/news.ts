export type NewsItem = {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  author?: string;
  featured: boolean;
  status: string;
  publishedAt?: string;
  image_url?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type NewsInput = Omit<NewsItem, "id">;
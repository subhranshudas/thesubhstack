export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string;
  readingTime: number; // minutes
  status: "published" | "draft";
}

export interface BlogPostFull extends BlogPost {
  content: string; // markdown content
  tableOfContents: TocItem[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface NotionDatabaseResponse {
  results: NotionPage[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionProperty>;
  cover?: NotionCover | null;
}

export interface NotionProperty {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface NotionCover {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string; expiry_time: string };
}

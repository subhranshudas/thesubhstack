import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thesubhstack.com";

async function getBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const { getAllPosts } = await import("@/lib/notion");
    const posts = await getAllPosts();
    return posts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/blogs/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}

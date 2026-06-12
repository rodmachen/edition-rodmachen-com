export function getPostSlug(id: string, data?: { slug?: string }): string {
  if (data?.slug) return data.slug;
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

export function getPostCategory(category: string | string[] | undefined): string {
  if (Array.isArray(category)) return category[0] || 'article';
  return category || 'article';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function extractFirstImage(markdown: string | undefined): string | undefined {
  if (!markdown) return undefined;
  const match = markdown.match(
    /!\[.*?\]\(((?:\/images\/|https?:\/\/res\.cloudinary\.com\/)\S+?)(?:\s+"[^"]*")?\)/,
  );
  return match?.[1];
}

type PostLike = {
  data: {
    category?: string | string[];
    [key: string]: unknown;
  };
};

export function getPostsByCategory<T extends PostLike>(posts: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (const post of posts) {
    const cat = getPostCategory(post.data.category);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(post);
  }
  return grouped;
}

type PublishableLike = {
  data: {
    published?: boolean;
    [key: string]: unknown;
  };
};

export function getPublishedPosts<T extends PublishableLike>(posts: T[]): T[] {
  return posts.filter((p) => p.data.published !== false);
}

export function getCategoryPath(category: string): string {
  return CATEGORY_CONFIG[category]?.path ?? category;
}

// Per-section accents are the LIGHT-mode values of the global.css
// --accent-<section> tokens (dark variants live in global.css). Keeping them
// here lets components that can't read CSS vars (e.g. inline placeholder
// backgrounds) stay aligned with the token system.
export const CATEGORY_CONFIG: Record<string, { label: string; description: string; accent: string; path: string }> = {
  newsletter: {
    label: 'Newsletter',
    description: 'The Hangman Chronicles',
    accent: '#8a2b1f', // oxblood
    path: 'newsletter',
  },
  byline: {
    label: 'Bylines',
    description: 'Published at external outlets',
    accent: '#6f6450', // muted taupe
    path: 'bylines',
  },
  article: {
    label: 'Articles',
    description: 'Long-form writing and original pieces',
    accent: '#b8654a', // clay
    path: 'articles',
  },
  review: {
    label: 'Reviews',
    description: 'Arts and Food reviews',
    accent: '#9a7b32', // ochre/gold
    path: 'reviews',
  },
};

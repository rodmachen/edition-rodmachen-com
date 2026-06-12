import type { CollectionEntry } from 'astro:content';
import { getCldImageUrl } from 'astro-cloudinary/helpers';
import { getPostSlug, getPostCategory, extractFirstImage } from './slugs';
export { getPostSlug, getPostCategory, formatDate, extractFirstImage, getPostsByCategory } from './slugs';

export type ListItem = {
  type: 'post' | 'byline';
  date: Date;
  title: string;
  subtitle?: string;
  href: string;
  category?: string;
  publication?: string;
  tags?: string[];
  image?: string;
};

const CLOUDINARY_PATTERN = /res\.cloudinary\.com/;

export function postToListItem(p: CollectionEntry<'posts'>): ListItem {
  const slug = getPostSlug(p.id, p.data);
  const cat = getPostCategory(p.data.category);

  let image: string | undefined;
  if (p.data.thumbnail) {
    // Thumbnail is a Cloudinary public ID — build a square-cropped URL
    image = getCldImageUrl({
      src: p.data.thumbnail,
      width: 200,
      height: 200,
      crop: { type: 'fill', gravity: 'auto', width: 200, height: 200, source: true },
    });
  } else {
    const extracted = extractFirstImage(p.body);
    if (extracted && CLOUDINARY_PATTERN.test(extracted)) {
      // Build a square-cropped thumbnail from the Cloudinary URL
      image = extracted.replace(
        /\/upload\//,
        '/upload/w_200,h_200,c_fill,g_auto,f_auto,q_auto/',
      );
    } else {
      image = extracted;
    }
  }

  return {
    type: 'post',
    date: p.data.date,
    title: p.data.title || slug,
    subtitle: p.data.subTitle,
    href: `/${cat}/${slug}/`,
    category: cat,
    tags: p.data.tags || [],
    image,
  };
}

const PUBLICATION_LOGOS: Record<string, string> = {
  'Austin Chronicle': '/images/austin-chronicle.png',
  'Cinapse': '/images/cinapse.png',
};

export function bylineToListItem(b: CollectionEntry<'bylines'>): ListItem {
  return {
    type: 'byline',
    date: b.data.date,
    title: b.data.title,
    subtitle: b.data.subTitle,
    href: b.data.url,
    category: 'byline',
    publication: b.data.publication,
    tags: b.data.tags || [],
    image: PUBLICATION_LOGOS[b.data.publication],
  };
}

export const CATEGORY_CONFIG: Record<string, { label: string; description: string; accent: string }> = {
  newsletter: {
    label: 'Newsletter',
    description: 'The Hangman Chronicles',
    accent: '#117a65',
  },
  byline: {
    label: 'Bylines',
    description: 'Published at external outlets',
    accent: '#2e4057',
  },
  article: {
    label: 'Articles',
    description: 'Long-form writing and original pieces',
    accent: '#1a5276',
  },
  essay: {
    label: 'Essays',
    description: 'Personal essays and opinion pieces',
    accent: '#6c3483',
  },
  review: {
    label: 'Reviews',
    description: 'Arts and Food reviews',
    accent: '#b9770e',
  },
};


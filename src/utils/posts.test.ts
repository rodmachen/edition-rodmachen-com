import { describe, it, expect } from 'vitest';
import {
  getPostSlug,
  getPostCategory,
  formatDate,
  extractFirstImage,
  getPostsByCategory,
} from './slugs';

describe('getPostSlug', () => {
  it('returns data.slug when present', () => {
    expect(getPostSlug('2014-02-20-something', { slug: 'custom-slug' })).toBe('custom-slug');
  });

  it('strips leading date prefix from id', () => {
    expect(getPostSlug('2014-02-20-first-look-kerlin-bbq')).toBe('first-look-kerlin-bbq');
  });

  it('returns id unchanged when no date prefix', () => {
    expect(getPostSlug('my-post')).toBe('my-post');
  });

  it('returns id unchanged when data has no slug', () => {
    expect(getPostSlug('2023-01-15-some-post', {})).toBe('some-post');
  });
});

describe('getPostCategory', () => {
  it('returns the string category as-is', () => {
    expect(getPostCategory('review')).toBe('review');
  });

  it('returns first element of array category', () => {
    expect(getPostCategory(['newsletter', 'article'])).toBe('newsletter');
  });

  it('returns "article" when undefined', () => {
    expect(getPostCategory(undefined)).toBe('article');
  });

  it('returns "article" for empty array', () => {
    expect(getPostCategory([])).toBe('article');
  });
});

describe('formatDate', () => {
  it('formats a date in en-US locale with short month', () => {
    const result = formatDate(new Date('2014-02-20T12:00:00.000Z'));
    expect(result).toMatch(/Feb/);
    expect(result).toMatch(/2014/);
  });

  it('includes the numeric day', () => {
    // Use local-time constructor to avoid UTC-to-local day shift
    const result = formatDate(new Date(2023, 5, 11));
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2023/);
    expect(result).toMatch(/11/);
  });
});

describe('extractFirstImage', () => {
  it('returns undefined for undefined input', () => {
    expect(extractFirstImage(undefined)).toBeUndefined();
  });

  it('returns undefined when no image is found', () => {
    expect(extractFirstImage('No images here, just text.')).toBeUndefined();
  });

  it('extracts a Cloudinary image URL', () => {
    const markdown = '![alt text](https://res.cloudinary.com/example/image/upload/v1/foo.jpg)';
    expect(extractFirstImage(markdown)).toBe(
      'https://res.cloudinary.com/example/image/upload/v1/foo.jpg',
    );
  });

  it('extracts a local /images/ path', () => {
    const markdown = '![photo](/images/my-photo.jpg)';
    expect(extractFirstImage(markdown)).toBe('/images/my-photo.jpg');
  });

  it('strips optional title from image markdown', () => {
    const markdown = '![alt](https://res.cloudinary.com/ex/img/foo.jpg "Title here")';
    expect(extractFirstImage(markdown)).toBe('https://res.cloudinary.com/ex/img/foo.jpg');
  });

  it('extracts the first image when multiple are present', () => {
    const markdown =
      'Text\n![one](/images/first.jpg)\nMore text\n![two](/images/second.jpg)';
    expect(extractFirstImage(markdown)).toBe('/images/first.jpg');
  });
});

describe('getPostsByCategory', () => {
  const makePost = (id: string, category?: string | string[]) => ({
    id,
    data: { category, date: new Date(), title: id },
  });

  it('groups posts by their category', () => {
    const posts = [
      makePost('post-a', 'review'),
      makePost('post-b', 'newsletter'),
      makePost('post-c', 'review'),
    ];
    const grouped = getPostsByCategory(posts);
    expect(grouped['review']).toHaveLength(2);
    expect(grouped['newsletter']).toHaveLength(1);
  });

  it('defaults to "article" for posts without a category', () => {
    const posts = [makePost('post-x', undefined)];
    const grouped = getPostsByCategory(posts);
    expect(grouped['article']).toHaveLength(1);
  });

  it('uses the first element of an array category', () => {
    const posts = [makePost('post-y', ['essay', 'article'])];
    const grouped = getPostsByCategory(posts);
    expect(grouped['essay']).toHaveLength(1);
  });

  it('returns an empty object for an empty input array', () => {
    expect(getPostsByCategory([])).toEqual({});
  });
});

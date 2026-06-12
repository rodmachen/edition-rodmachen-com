import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import remarkCloudinaryImages from './src/plugins/remark-cloudinary-images.js';
import remarkDemoteHeadings from './src/plugins/remark-demote-headings.js';

export default defineConfig({
  site: 'https://edition.rodmachen.com',
  trailingSlash: 'always',
  adapter: vercel(),
  output: 'static',
  integrations: [sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  markdown: {
    remarkPlugins: [remarkCloudinaryImages, remarkDemoteHeadings],
  },
});

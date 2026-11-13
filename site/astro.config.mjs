// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';

export default defineConfig({
  site: 'https://verde.fjbatresv.com',
  markdown: {
    processor: unified({ remarkPlugins: [remarkMermaid] }),
  },
  integrations: [
    starlight({
      title: 'VERDE',
      description:
        'Vault-Driven Development: un framework para desarrollar aplicaciones con agentes de IA, con roles fijos, memoria fuera del chat y nada integrado sin evidencia.',
      logo: { src: './src/assets/logo.svg', alt: 'VERDE' },
      favicon: '/favicon.svg',
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://verde.fjbatresv.com/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'VERDE · Vault-Driven Development · make gate → RESULT GREEN',
          },
        },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'author', content: 'Javier Batres' } },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: 'Español', lang: 'es' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/fjbatresv/verde' },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/components/Head.astro',
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        { label: 'Empezar', translations: { en: 'Get started' }, slug: 'empezar' },
        { label: 'El estándar', translations: { en: 'The standard' }, slug: 'estandar' },
        {
          label: 'Guías',
          translations: { en: 'Guides' },
          items: [
            { label: 'Herramientas recomendadas', translations: { en: 'Recommended tools' }, slug: 'guias/herramientas' },
            { label: 'Guía del revisor', translations: { en: 'Reviewer guide' }, slug: 'guias/revision' },
            { label: 'Plantillas', translations: { en: 'Templates' }, slug: 'plantillas' },
          ],
        },
        {
          label: 'Ejemplo resuelto',
          translations: { en: 'Worked example' },
          items: [{ autogenerate: { directory: 'ejemplo' } }],
        },
        { label: 'Changelog', items: [{ autogenerate: { directory: 'changelog' } }] },
      ],
    }),
  ],
});

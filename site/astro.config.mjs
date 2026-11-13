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
        { label: 'Changelog', slug: 'changelog' },
      ],
    }),
  ],
});

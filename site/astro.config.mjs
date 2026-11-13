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
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/fjbatresv/verde' },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/components/Head.astro',
      },
      sidebar: [
        { label: 'Empezar', link: '/empezar/' },
        { label: 'El estándar', link: '/estandar/' },
        {
          label: 'Guías',
          items: [
            { label: 'Guía del revisor', link: '/guias/revision/' },
            { label: 'Plantillas', link: '/plantillas/' },
          ],
        },
        { label: 'Ejemplo resuelto', items: [{ autogenerate: { directory: 'ejemplo' } }] },
        { label: 'Changelog', link: '/changelog/' },
      ],
    }),
  ],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';

// O plugin do MDX precisa vir ANTES do plugin do React (enforce: 'pre'):
// ele transforma o .mdx em JSX, e o React então o compila como qualquer
// componente. O remarkMdxFrontmatter é o que transforma o bloco YAML do topo
// num export chamado `frontmatter` — sem ele, o YAML vira texto na tela.
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        // Sem providerImportSource o MDX compilado ignora o MDXProvider: nem o
        // mapa de elementos do Design System nem componentes como FiguraExterna
        // chegam ao conteúdo. É esta linha que liga os dois.
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
      }),
    },
    react({ include: /\.(jsx|js|mdx)$/ }),
  ],
});

// Mapa que o MDXProvider usa: o Markdown do conteúdo sai estilizado pelo
// Design System sem precisar de uma única classe dentro dos arquivos .mdx.
export const componentesMdx = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...props} />,
  img: (props) => <img loading="lazy" {...props} />,
};

import FiguraExterna from '../components/FiguraExterna';

// Mapa que o MDXProvider usa: o Markdown do conteúdo sai estilizado pelo
// Design System sem precisar de uma única classe dentro dos arquivos .mdx.
//
// Componentes nomeados (FiguraExterna) ficam disponíveis como tag dentro de
// qualquer .mdx, sem import no arquivo de conteúdo.
export const componentesMdx = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...props} />,
  img: (props) => <img loading="lazy" {...props} />,
  FiguraExterna,
};

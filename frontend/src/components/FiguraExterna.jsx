import SecaoVazia from './SecaoVazia';
import estilos from './FiguraExterna.module.css';

/* Figura que credita e aponta para a fonte: usada nas experiências, onde a
   imagem é de terceiros (site oficial do programa, do projeto de extensão).
   A imagem NÃO é hospedada aqui, só linkada à origem.

   Enquanto `src` não existir, cai no SecaoVazia com o rótulo do que vai entrar.
   Na Sprint 02 basta passar o src e o resto do layout já está de pé. */
export default function FiguraExterna({ src, alt, href, legenda, reservado, altura = 200 }) {
  const imagem = src ? (
    <img className={estilos.imagem} src={src} alt={alt} loading="lazy" />
  ) : (
    <SecaoVazia altura={altura}>{reservado}</SecaoVazia>
  );

  return (
    <figure className={estilos.figura}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={estilos.alvo}>
          {imagem}
        </a>
      ) : (
        imagem
      )}
      {legenda && <figcaption className="metadado">{legenda}</figcaption>}
    </figure>
  );
}

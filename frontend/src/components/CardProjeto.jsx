import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import estilos from './CardProjeto.module.css';

export default function CardProjeto({ projeto }) {
  const { t } = useTranslation();
  const { slug, titulo, ano, ordem, stack = [], repo, capa, Corpo } = projeto;

  /* Enquanto nem todo projeto tem capa, o arquivo declarado no frontmatter pode
     não existir. Sem isto o navegador desenha o ícone de imagem quebrada, que
     parece defeito; com isto o card cai no mesmo espaço reservado dos projetos
     que ainda não declararam capa nenhuma. */
  const [capaFalhou, setCapaFalhou] = useState(false);
  const mostrarCapa = capa && !capaFalhou;

  return (
    <article className={estilos.card}>
      <div className={estilos.capa}>
        {mostrarCapa ? (
          <img src={capa} alt={t('projetos.capa_alt', { titulo })} loading="lazy"
            width="640" height="360" onError={() => setCapaFalhou(true)} />
        ) : (
          <div className={estilos.capaReservada} aria-hidden="true">
            <span className={estilos.monograma}>{titulo.slice(0, 2).toUpperCase()}</span>
            <span>{titulo}</span>
          </div>
        )}
      </div>

      <div className={estilos.texto}>
        <p className={estilos.ano}>
          {ano}
          <span aria-hidden="true"> · </span>
          {String(ordem).padStart(2, '0')}
        </p>
        <h3 className={estilos.titulo}>{titulo}</h3>

        {/* O corpo do MDX entra aqui como resumo. Na página de detalhe ele
            aparece inteiro; no card o CSS corta nas primeiras linhas. */}
        <div className={estilos.resumo}>{Corpo ? <Corpo /> : null}</div>

        {stack.length > 0 && (
          <ul className={estilos.stack}>
            {stack.slice(0, 4).map((tec) => (
              <li key={tec} className={estilos.chip}>{tec}</li>
            ))}
            {stack.length > 4 && <li className={estilos.mais}>{t('projetos.mais_tecnologias', { count: stack.length - 4 })}</li>}
          </ul>
        )}

        <p className={estilos.acoes}>
          <Link to={`/projetos/${slug}`}>
            {t('projetos.ver_projeto')} <FiArrowRight aria-hidden="true" />
          </Link>
          {repo && (
            <a className={estilos.repositorio} href={repo} target="_blank" rel="noopener noreferrer">
              {t('projetos.repositorio')} <FiExternalLink aria-hidden="true" />
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

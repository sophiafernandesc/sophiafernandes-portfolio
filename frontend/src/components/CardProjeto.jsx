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
        {/* A moldura de janela vale para capa e para espaço reservado: dá
            enquadramento comum a material de tipos diferentes (captura de
            tela, card de título, foto de hardware) e mantém a coluna com o
            mesmo ritmo, com ou sem imagem. */}
        <div className={estilos.janela}>
          <span className={estilos.barra} aria-hidden="true">
            <span className={estilos.ponto} />
            <span className={estilos.ponto} />
            <span className={estilos.ponto} />
          </span>
          {mostrarCapa ? (
            <img
              src={capa}
              alt={t('projetos.capa_alt', { titulo })}
              loading="lazy"
              onError={() => setCapaFalhou(true)}
            />
          ) : (
            <span className={estilos.capaReservada}>{t('projetos.capa_reservada')}</span>
          )}
        </div>
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
            {stack.map((tec) => (
              <li key={tec} className={estilos.chip}>{tec}</li>
            ))}
          </ul>
        )}

        <p className={estilos.acoes}>
          <Link to={`/projetos/${slug}`}>
            {t('projetos.ver_projeto')} <FiArrowRight aria-hidden="true" />
          </Link>
          {repo && (
            <a href={repo} target="_blank" rel="noopener noreferrer">
              {t('projetos.repositorio')} <FiExternalLink aria-hidden="true" />
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

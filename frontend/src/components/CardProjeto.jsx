import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import estilos from './CardProjeto.module.css';

export default function CardProjeto({ projeto }) {
  const { t } = useTranslation();
  const { slug, titulo, ano, ordem, stack = [], repo, capa, Corpo } = projeto;

  return (
    <article className={estilos.card}>
      <div className={estilos.capa}>
        {capa ? (
          <img src={capa} alt={t('projetos.capa_alt', { titulo })} loading="lazy" />
        ) : (
          <span className="metadado">foto / GIF do projeto</span>
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

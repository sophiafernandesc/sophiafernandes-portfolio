import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import useIdioma from '../hooks/useIdioma';
import { getProjeto } from '../conteudo/projetos';
import estilos from './ProjetoDetalhe.module.css';

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const idioma = useIdioma();
  const projeto = getProjeto(slug, idioma);

  if (!projeto) {
    return (
      <>
        <h1>{t('erro.nao_encontrado')}</h1>
        <Link to="/projetos">← {t('projetos.titulo')}</Link>
      </>
    );
  }

  const { titulo, ano, stack = [], repo, Corpo } = projeto;

  return (
    <article className={estilos.pagina}>
      <Link to="/projetos" className={estilos.voltar}>
        <FiArrowLeft aria-hidden="true" /> {t('projetos.titulo')}
      </Link>

      <header className={estilos.cabecalho}>
        <p className="metadado">{ano}</p>
        <h1>{titulo}</h1>
        {stack.length > 0 && (
          <ul className={estilos.stack}>
            {stack.map((tec) => <li key={tec} className={estilos.chip}>{tec}</li>)}
          </ul>
        )}
        {repo && (
          <p>
            <a href={repo} target="_blank" rel="noopener noreferrer">
              {t('projetos.repositorio')} <FiExternalLink aria-hidden="true" />
            </a>
          </p>
        )}
      </header>

      {/* O corpo do .mdx, inteiro. É aqui que a página cresce com o tempo:
          arquitetura, diagramas e capturas entram no arquivo, não neste JSX. */}
      <div className={estilos.corpo}>
        <Corpo />
      </div>
    </article>
  );
}

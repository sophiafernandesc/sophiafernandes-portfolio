import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardProjeto from '../components/CardProjeto';
import useIdioma from '../hooks/useIdioma';
import { getProjetos, getTags } from '../conteudo/projetos';
import estilos from './Projetos.module.css';

export default function Projetos() {
  const { t } = useTranslation();
  const idioma = useIdioma();
  const projetos = getProjetos(idioma);
  const tags = getTags(idioma);
  const [filtro, setFiltro] = useState(null);

  const visiveis = filtro ? projetos.filter((p) => p.tags?.includes(filtro)) : projetos;

  return (
    <>
      <header className={estilos.cabecalho}>
        <h1>{t('projetos.titulo')}</h1>
        <p className="metadado">{t('projetos.subtitulo', { count: projetos.length })}</p>
      </header>

      <div className={estilos.filtros} role="group" aria-label={t('projetos.titulo')}>
        <button
          type="button"
          onClick={() => setFiltro(null)}
          aria-pressed={filtro === null}
          className={`${estilos.chip} ${filtro === null ? estilos.chipAtivo : ''}`}
        >
          {t('projetos.filtro_todos')}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFiltro(tag === filtro ? null : tag)}
            aria-pressed={filtro === tag}
            className={`${estilos.chip} ${filtro === tag ? estilos.chipAtivo : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p>{t('projetos.vazio')}</p>
      ) : (
        <ol className={estilos.timeline}>
          {visiveis.map((projeto) => (
            <li key={projeto.slug} className={estilos.item}>
              <div className={estilos.trilho} aria-hidden="true">
                <span className={estilos.ano}>{projeto.ano}</span>
                <span className={estilos.linha} />
              </div>
              <CardProjeto projeto={projeto} />
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

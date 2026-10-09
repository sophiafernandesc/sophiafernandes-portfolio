import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';
import CardProjeto from '../components/CardProjeto';
import SecaoVazia from '../components/SecaoVazia';
import useIdioma from '../hooks/useIdioma';
import { getProjetos } from '../conteudo/projetos';
import { LINKS } from '../config/links';
import estilos from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();
  const idioma = useIdioma();
  const projetos = getProjetos(idioma);
  const destaques = projetos.filter((p) => p.destaque).slice(0, 3);

  return (
    <>
      <section className={estilos.hero}>
        <div className={estilos.coluna}>
          <SecaoVazia altura={400}>{t('home.foto_alt')}</SecaoVazia>
          <ol className={estilos.indice}>
            <li><a href="#wakatime"><span aria-hidden="true">01 - </span>{t('home.wakatime')}</a></li>
            <li><a href="#projetos"><span aria-hidden="true">02 - </span>{t('home.projetos')}</a></li>
            <li><Link to="/experiencias"><span aria-hidden="true">03 - </span>{t('menu.experiencias')}</Link></li>
          </ol>
        </div>

        <div>
          <h1 className={estilos.nome}>Sophia Fernandes</h1>
          <p className={estilos.papel}>
            {t('home.papel')}
            <span aria-hidden="true"> / </span>
            <span className={estilos.local}>{t('home.local')}</span>
          </p>
          <p className={estilos.resumo}>{t('home.resumo')}</p>

          <div className={estilos.acoes}>
            <a className={estilos.botaoPrimario} href={LINKS.curriculo} target="_blank" rel="noopener noreferrer">
              <FiFileText aria-hidden="true" /> {t('home.curriculo')}
            </a>
            <Link className={estilos.botao} to="/contato">
              <FiMail aria-hidden="true" /> {t('home.contato')}
            </Link>
            <a className={estilos.botao} href={LINKS.github} target="_blank" rel="noopener noreferrer">
              <FiGithub aria-hidden="true" /> GitHub
            </a>
            <a className={estilos.botao} href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              <FiLinkedin aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <figure className={estilos.figura}>
        <SecaoVazia altura={300}>{t('home.lanyard_reservado')}</SecaoVazia>
        <figcaption className="metadado">{t('home.lanyard_legenda')}</figcaption>
      </figure>

      <section id="wakatime" className={estilos.secao}>
        <h2 className="rotulo">
          <span aria-hidden="true">01 - </span>{t('home.wakatime')}
          <span aria-hidden="true"> · </span>{t('home.wakatime_periodo')}
        </h2>
        <SecaoVazia altura={200}>gráfico de barras - horas por linguagem</SecaoVazia>
      </section>

      <section id="projetos" className={estilos.secao}>
        <h2 className="rotulo">
          <span aria-hidden="true">02 - </span>{t('home.projetos')}
          <span aria-hidden="true"> · </span>{t('home.projetos_sub')}
        </h2>
        <div className={estilos.lista}>
          {destaques.map((p) => <CardProjeto key={p.slug} projeto={p} />)}
        </div>
        <Link to="/projetos" className={estilos.verTodos}>
          {t('home.ver_todos', { count: projetos.length })} →
        </Link>
      </section>
    </>
  );
}

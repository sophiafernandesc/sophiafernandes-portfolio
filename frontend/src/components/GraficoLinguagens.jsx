import { useTranslation } from 'react-i18next';
import dados from '../conteudo/wakatime.json';
import estilos from './GraficoLinguagens.module.css';

const ARQUIVOS_DE_APOIO = new Set(['Markdown', 'GitIgnore file', 'Git Config', 'YAML', 'JSON', 'Text', 'TOML', 'XML']);
const CATEGORIAS = { Coding: 'programando', 'Writing Docs': 'documentando', 'Writing Tests': 'testando', Debugging: 'depurando', Browsing: 'navegando', Designing: 'projetando', 'Code Reviewing': 'revisando', 'Running Tests': 'executando_testes' };

export default function GraficoLinguagens() {
  const { t, i18n } = useTranslation();
  const { linguagens = [], totalSegundos, atualizadoEm, inicioEm } = dados;
  if (!linguagens.length) return <p className="metadado">{t('home.wakatime_vazio')}</p>;
  const principais = linguagens.filter((item) => item.nome && !ARQUIVOS_DE_APOIO.has(item.nome)).sort((a, b) => b.segundos - a.segundos);
  const apoio = linguagens.filter((item) => !principais.includes(item));
  const duracao = (segundos) => {
    const minutos = Math.round(segundos / 60);
    return t('home.wakatime_duracao', { h: Math.floor(minutos / 60), min: String(minutos % 60).padStart(2, '0') });
  };
  /* As duas datas vem em ISO do build e sao formatadas aqui, no idioma de quem
     visita: a API so entrega o inicio como texto em ingles. O meio-dia evita
     que o fuso jogue a data para o dia anterior. */
  const formatar = (iso) => (iso ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`)) : null);
  const data = formatar(atualizadoEm);
  const inicio = formatar(inicioEm);

  function linhas(itens, categoria = false) {
    return <ul className={estilos.lista}>{itens.map((item, indice) => {
      const percentual = Math.max(0, Math.min(100, item.percentual ?? 0));
      const nome = categoria && CATEGORIAS[item.nome] ? t(`home.wakatime_categorias.${CATEGORIAS[item.nome]}`)
        : item.nome ?? t('home.wakatime_outras', { quantas: item.quantas });
      return <li key={nome} className={estilos.linha}>
        <span className={estilos.nome}>{nome}</span>
        <span className={estilos.trilho} aria-hidden="true">{Array.from({ length: 24 }, (_, bloco) => (
          <span key={bloco} className={bloco < Math.round(percentual * 24 / 100)
            ? (indice === 0 ? estilos.segmentoDestaque : estilos.segmentoPreenchido) : estilos.segmento} />
        ))}</span>
        <span className={estilos.tempo}>{duracao(item.segundos)}</span>
        <span className={estilos.percentual}>{new Intl.NumberFormat(i18n.resolvedLanguage, { maximumFractionDigits: 1 }).format(percentual)}%</span>
      </li>;
    })}</ul>;
  }
  function grupo(titulo, itens, categoria = false) {
    if (!itens?.length) return null;
    return <section className={estilos.grupo}><h3><span aria-hidden="true"># </span>{titulo}</h3>{linhas(itens, categoria)}</section>;
  }

  return (
    <div className={estilos.bloco}>
      <header className={estilos.cabecalho}>
        <div><p className={estilos.rotulo}>{t('home.wakatime_total')}</p><p className={estilos.numero}>{duracao(totalSegundos)}</p></div>
        <div className={estilos.contexto}>
          {data && <p>{inicio
            ? t('home.wakatime_intervalo', { inicio, data })
            : t('home.wakatime_registradas', { data })}</p>}
          <p>{t('home.wakatime_total_nota')}</p>
        </div>
      </header>
      {grupo(t('home.wakatime_linguagens'), principais.slice(0, 8))}
      {principais.length > 8 && <details className={estilos.adicionais}><summary>{t('home.wakatime_mais_linguagens')}</summary>{linhas(principais.slice(8))}</details>}
      {apoio.length > 0 && <details className={estilos.adicionais}><summary>{t('home.wakatime_outros_registros')}</summary>{linhas(apoio)}</details>}
      {grupo(t('home.wakatime_categorias_titulo'), dados.categorias?.filter((item) => !/\bai\b|artificial intelligence/i.test(item.nome)), true)}
      {grupo(t('home.wakatime_sistemas'), dados.sistemas)}
    </div>
  );
}

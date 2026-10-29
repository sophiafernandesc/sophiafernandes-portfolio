import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiActivity, FiCalendar, FiClock } from 'react-icons/fi';
import { SiCss, SiDocker, SiGnubash, SiHtml5, SiJavascript, SiOpenjdk, SiPython, SiTypescript } from 'react-icons/si';
import doBuild from '../conteudo/wakatime.json';
import { normalizarWakatime } from '../conteudo/normalizarWakatime';
import { buscarWakatime } from '../services/wakatime';
import estilos from './GraficoLinguagens.module.css';

const ARQUIVOS_DE_APOIO = new Set([
  'Markdown', 'GitIgnore file', 'Git Config', 'YAML', 'JSON', 'Text', 'TOML',
  'XML', 'Properties', 'Java Properties', 'INI', 'CSV', 'CSV/TSV', 'textmate',
  'IDEA_MODULE', 'Image (svg)', 'Other',
]);

const IDES = new Set(['IntelliJ IDEA', 'PyCharm', 'WebStorm', 'DataGrip', 'CLion',
  'GoLand', 'PhpStorm', 'RubyMine', 'Rider', 'Android Studio', 'Eclipse',
  'NetBeans', 'VS Code', 'Visual Studio Code', 'Visual Studio', 'Xcode',
  'Sublime Text', 'Vim', 'Neovim']);

const ICONES = {
  Java: SiOpenjdk,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  HTML: SiHtml5,
  CSS: SiCss,
  Python: SiPython,
  Bash: SiGnubash,
  Docker: SiDocker,
};

const QUANTAS_EM_DESTAQUE = 8;

export default function GraficoLinguagens() {
  const { t, i18n } = useTranslation();
  const [dados, setDados] = useState(doBuild);
  useEffect(() => {
    let vivo = true;
    buscarWakatime()
      .then((cru) => normalizarWakatime(cru))
      .then((frescos) => { if (vivo && frescos) setDados(frescos); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  const { linguagens = [], totalSegundos, mediaDiariaSegundos,
    diasComRegistro, diasTotais, inicioEm } = dados;

  if (!linguagens.length) return <p className="metadado">{t('home.wakatime_vazio')}</p>;

  const principais = linguagens
    .filter((item) => item.nome && !ARQUIVOS_DE_APOIO.has(item.nome))
    .sort((a, b) => b.segundos - a.segundos);

  const duracao = (segundos) => {
    const minutos = Math.round((segundos ?? 0) / 60);
    return t('home.wakatime_duracao', {
      h: Math.floor(minutos / 60),
      min: String(minutos % 60).padStart(2, '0'),
    });
  };
  const numero = (valor) => new Intl.NumberFormat(i18n.resolvedLanguage).format(valor);
  const porcento = (valor) => new Intl.NumberFormat(i18n.resolvedLanguage,
    { maximumFractionDigits: 1 }).format(valor ?? 0);
  const dataLonga = (iso) => (iso ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`)) : null);

  function estatistica(Icone, rotulo, valor, nota) {
    return (
      <div className={estilos.estatistica}>
        <p className={estilos.rotulo}>
          <Icone aria-hidden="true" /> {rotulo}
        </p>
        <p className={estilos.numero}>{valor}</p>
        {nota && <p className={estilos.nota}>{nota}</p>}
      </div>
    );
  }

  function cards(itens, comPercentual = true) {
    const maior = itens[0]?.segundos || 1;
    return (
      <ul className={estilos.grade}>
        {itens.map((item, indice) => {
          const Icone = ICONES[item.nome];
          return (
            <li key={item.nome} className={estilos.card}>
              <span className={estilos.medalhao} aria-hidden="true">
                {/* pathLength=100 deixa o dasharray trabalhar direto em
                    porcentagem, sem depender do raio. O giro de -90 graus
                    faz o arco comecar no topo em vez da direita. */}
                <svg className={estilos.anel} viewBox="0 0 40 40">
                  <circle className={estilos.anelTrilho} cx="20" cy="20" r="18" pathLength="100" />
                  <circle
                    className={indice === 0 ? estilos.anelDestaque : estilos.anelProgresso}
                    cx="20" cy="20" r="18" pathLength="100"
                    strokeDasharray={`${(item.segundos / maior) * 100} 100`} />
                </svg>
                <span className={estilos.icone}>{Icone ? <Icone /> : null}</span>
              </span>
              <p className={estilos.nome}>{item.nome}</p>
              <p className={estilos.tempo}>{duracao(item.segundos)}</p>
              {comPercentual && (
                <p className={estilos.percentual}>{porcento(item.percentual)}%</p>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const ides = (dados.editores ?? []).filter((item) => IDES.has(item.nome));
  const inicio = dataLonga(inicioEm);
  const restantes = principais.slice(QUANTAS_EM_DESTAQUE);

  return (
    <div className={estilos.bloco}>
      <header className={estilos.cabecalho}>
        {estatistica(FiClock, t('home.wakatime_total'), duracao(totalSegundos),
          inicio && t('home.wakatime_desde', { data: inicio }))}
        {estatistica(FiActivity, t('home.wakatime_media'), duracao(mediaDiariaSegundos),
          t('home.wakatime_media_nota'))}
        {diasComRegistro != null && estatistica(FiCalendar,
          t('home.wakatime_dias_ativos'), numero(diasComRegistro),
          diasTotais != null && t('home.wakatime_dias_nota', { total: numero(diasTotais) }))}
      </header>

      <section className={estilos.grupo}>
        <h3><span aria-hidden="true"># </span>{t('home.wakatime_linguagens')}</h3>
        {cards(principais.slice(0, QUANTAS_EM_DESTAQUE))}
      </section>

      {restantes.length > 0 && (
        <details className={estilos.adicionais}>
          <summary>{t('home.wakatime_mais_linguagens')}</summary>
          {cards(restantes)}
        </details>
      )}

      {ides.length > 0 && (
        <section className={estilos.grupo}>
          <h3><span aria-hidden="true"># </span>{t('home.wakatime_ides')}</h3>
          {cards(ides, false)}
        </section>
      )}
    </div>
  );
}

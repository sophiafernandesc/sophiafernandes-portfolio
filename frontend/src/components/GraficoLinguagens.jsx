import { useTranslation } from 'react-i18next';
import dados from '../conteudo/wakatime.json';
import estilos from './GraficoLinguagens.module.css';

// Horas de código por linguagem, do WakaTime. Os dados vêm de
// src/conteudo/wakatime.json, gravado no build por scripts/baixar-wakatime.mjs
// (a API pública não manda CORS, então o navegador não consegue buscar direto).
//
// Uma série só, então sem legenda: cada barra já é rotulada. As barras são
// neutras e só a maior usa o acento, que é o que cria a hierarquia sem
// transformar a seção em papel de parede roxo.

export default function GraficoLinguagens() {
  const { t, i18n } = useTranslation();
  const { linguagens, totalSegundos, mediaDiariaSegundos, atualizadoEm } = dados;

  if (!linguagens?.length) {
    return <p className="metadado">{t('home.wakatime_vazio')}</p>;
  }

  // A barra é proporcional à maior, não ao total: com a maior em 26% todas
  // ficariam espremidas na esquerda e a comparação sumiria.
  const maior = Math.max(...linguagens.map((l) => l.segundos));

  const duracao = (segundos) => t('home.wakatime_duracao', {
    h: Math.floor(segundos / 3600),
    min: String(Math.round((segundos % 3600) / 60)).padStart(2, '0'),
  });

  return (
    <div className={estilos.bloco}>
      <ul className={estilos.lista}>
        {linguagens.map((linguagem, indice) => {
          const nome = linguagem.nome ?? t('home.wakatime_outras', { quantas: linguagem.quantas });
          return (
            <li key={nome} className={estilos.linha}>
              <span className={estilos.nome}>{nome}</span>
              <span
                className={estilos.trilho}
                aria-hidden="true"
                title={`${linguagem.percentual}%`}
              >
                <span
                  className={indice === 0 ? estilos.barraDestaque : estilos.barra}
                  style={{ inlineSize: `${(linguagem.segundos / maior) * 100}%` }}
                />
              </span>
              <span className={estilos.tempo}>{duracao(linguagem.segundos)}</span>
            </li>
          );
        })}
      </ul>

      <p className={`${estilos.resumo} metadado`}>
        {t('home.wakatime_resumo', {
          total: duracao(totalSegundos),
          media: duracao(mediaDiariaSegundos),
          data: new Date(`${atualizadoEm}T00:00:00`).toLocaleDateString(i18n.language),
        })}
      </p>
    </div>
  );
}

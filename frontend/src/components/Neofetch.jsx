import { useTranslation } from 'react-i18next';
import estilos from './Neofetch.module.css';

export default function Neofetch() {
  const { t } = useTranslation();
  const campos = t('neofetch.campos', { returnObjects: true });
  const dados = Array.isArray(campos) ? [campos[1], campos[2], campos[3]] : [];
  return (
    <div className={estilos.resumo}>
      <dl className={estilos.dados}>
        {dados.map(({ chave, valor }) => (
          <div key={chave} className={estilos.linha}>
            <dt className={estilos.chave}>{chave}</dt>
            <dd className={estilos.valor}>{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

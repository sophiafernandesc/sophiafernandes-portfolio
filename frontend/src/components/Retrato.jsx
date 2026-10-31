import { useTranslation } from 'react-i18next';
import estilos from './Retrato.module.css';

export default function Retrato() {
  const { t } = useTranslation();
  return (
    <figure className={estilos.moldura}>
      <img className={estilos.foto} src="/img/retrato.webp"
        alt={t('home.foto_alt')} width="460" height="460" />
    </figure>
  );
}

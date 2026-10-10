import { useTranslation } from 'react-i18next';
import estilos from './Cracha.module.css';

export default function Cracha() {
  const { t } = useTranslation();
  return (
    <figure className={estilos.cartao}>
      <img className={estilos.foto} src="/img/foto-cracha.webp"
        alt={t('home.foto_alt')} width="447" height="559" />
    </figure>
  );
}

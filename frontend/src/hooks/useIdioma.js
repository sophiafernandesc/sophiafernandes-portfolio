import { useTranslation } from 'react-i18next';

/** Devolve 'pt' ou 'en': é o que as pastas de conteúdo usam. */
export default function useIdioma() {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt';
}

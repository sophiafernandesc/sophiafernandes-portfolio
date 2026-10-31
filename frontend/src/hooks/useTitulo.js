import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function useTitulo(nome) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = nome ? `${nome} · ${t('titulo.marca')}` : t('titulo.home');
  }, [nome, t, i18n.resolvedLanguage]);
}

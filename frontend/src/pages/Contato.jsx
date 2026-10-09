import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiMessageCircle, FiLinkedin, FiGithub } from 'react-icons/fi';
import { LINKS } from '../config/links';
import { enviarContato } from '../services/contato';
import estilos from './Contato.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contato() {
  const { t } = useTranslation();
  const [estado, setEstado] = useState('ocioso'); // ocioso | enviando | ok | erro
  const [erros, setErros] = useState({});

  const canais = [
    { icone: FiMail, rotulo: 'E-mail', valor: LINKS.email, href: `mailto:${LINKS.email}` },
    { icone: FiMessageCircle, rotulo: 'WhatsApp', valor: LINKS.whatsappTexto, href: LINKS.whatsapp },
    { icone: FiLinkedin, rotulo: 'LinkedIn', valor: LINKS.linkedinTexto, href: LINKS.linkedin },
    { icone: FiGithub, rotulo: 'GitHub', valor: LINKS.githubTexto, href: LINKS.github },
  ];

  async function enviar(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);

    // Campo isca: invisível para pessoas, robô costuma preencher.
    // Finge sucesso para o robô não tentar de novo, mas não envia nada.
    if (dados.get('website')) {
      setEstado('ok');
      evento.currentTarget.reset();
      return;
    }

    const nome = String(dados.get('nome') ?? '').trim();
    const email = String(dados.get('email') ?? '').trim();
    const mensagem = String(dados.get('mensagem') ?? '').trim();

    const novosErros = {};
    if (!nome) novosErros.nome = t('contato.erro_nome');
    if (!EMAIL_RE.test(email)) novosErros.email = t('contato.erro_email');
    if (!mensagem) novosErros.mensagem = t('contato.erro_mensagem');
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const formulario = evento.currentTarget;
    setEstado('enviando');
    try {
      await enviarContato({ nome, email, mensagem });
      setEstado('ok');
      formulario.reset();
    } catch {
      setEstado('erro');
    }
  }

  return (
    <>
      <header className={estilos.cabecalho}>
        <h1>{t('contato.titulo')}</h1>
        <p className="metadado">{t('contato.subtitulo')}</p>
      </header>

      <div className={estilos.grade}>
        <section aria-labelledby="canais">
          <h2 id="canais" className="rotulo">{t('contato.canais')}</h2>
          <ul className={estilos.canais}>
            {canais.map(({ icone: Icone, rotulo, valor, href }) => (
              <li key={rotulo}>
                <a className={estilos.canal} href={href} target="_blank" rel="noopener noreferrer">
                  <span className={estilos.icone}><Icone aria-hidden="true" /></span>
                  <span>
                    <strong>{rotulo}</strong>
                    <span className="metadado">{valor}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={estilos.formBloco} aria-labelledby="form-titulo">
          <h2 id="form-titulo" className={estilos.formTitulo}>{t('contato.form_titulo')}</h2>

          <form onSubmit={enviar} noValidate>
            {/* honeypot: escondido de pessoas, não de robôs */}
            <div className={estilos.isca} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className={estilos.linha}>
              <div className={estilos.campo}>
                <label htmlFor="nome">{t('contato.nome')}</label>
                <input id="nome" name="nome" type="text" maxLength={100}
                  placeholder={t('contato.nome_ph')} required
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? 'erro-nome' : undefined} />
                {erros.nome && <p id="erro-nome" className={estilos.erroCampo}>{erros.nome}</p>}
              </div>

              <div className={estilos.campo}>
                <label htmlFor="email">{t('contato.email')}</label>
                <input id="email" name="email" type="email" maxLength={254}
                  placeholder={t('contato.email_ph')} required
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby={erros.email ? 'erro-email' : undefined} />
                {erros.email && <p id="erro-email" className={estilos.erroCampo}>{erros.email}</p>}
              </div>
            </div>

            <div className={estilos.campo}>
              <label htmlFor="mensagem">{t('contato.mensagem')}</label>
              <textarea id="mensagem" name="mensagem" rows={6} maxLength={2000}
                placeholder={t('contato.mensagem_ph')} required
                aria-invalid={Boolean(erros.mensagem)}
                aria-describedby={erros.mensagem ? 'erro-mensagem' : undefined} />
              {erros.mensagem && <p id="erro-mensagem" className={estilos.erroCampo}>{erros.mensagem}</p>}
            </div>

            {/* TODO Sprint 02: reCAPTCHA v2 acima do botão, validado no back-end */}

            <div className={estilos.acoes}>
              <button type="submit" className={estilos.botao} disabled={estado === 'enviando'}>
                {estado === 'enviando' ? t('contato.enviando') : t('contato.enviar')}
              </button>
              <span className="metadado">{t('contato.protecao')}</span>
            </div>

            <p role="status" aria-live="polite" className={estilos.status}>
              {estado === 'ok' && t('contato.sucesso')}
              {estado === 'erro' && t('contato.erro')}
            </p>
          </form>
        </section>
      </div>
    </>
  );
}

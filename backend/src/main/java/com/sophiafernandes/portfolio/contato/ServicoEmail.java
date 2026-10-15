package com.sophiafernandes.portfolio.contato;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

/**
 * Entrega a mensagem do formulário por SMTP.
 *
 * Monta MimeMessage em vez de SimpleMailMessage só por causa do UTF-8: acento
 * em nome e mensagem é a regra, não a exceção.
 */
@Service
public class ServicoEmail {

    private final JavaMailSender remetente;
    private final PropriedadesContato propriedades;

    public ServicoEmail(JavaMailSender remetente, PropriedadesContato propriedades) {
        this.remetente = remetente;
        this.propriedades = propriedades;
    }

    /** Envia a mensagem. Lança MailException se o SMTP recusar. */
    public void enviar(ContatoRequisicao requisicao) {
        MimeMessagePreparator preparador = mime -> {
            MimeMessageHelper ajudante = new MimeMessageHelper(mime, false, "UTF-8");
            ajudante.setFrom(propriedades.remetente());
            ajudante.setTo(propriedades.destinatario());
            // Responder no cliente de e-mail já endereça para quem escreveu.
            ajudante.setReplyTo(requisicao.email());
            ajudante.setSubject("Contato pelo portfólio · " + requisicao.nome());
            ajudante.setText(corpo(requisicao), false);
        };
        remetente.send(preparador);
    }

    private String corpo(ContatoRequisicao requisicao) {
        return """
                Nome: %s
                E-mail: %s

                %s
                """.formatted(requisicao.nome(), requisicao.email(), requisicao.mensagem());
    }
}
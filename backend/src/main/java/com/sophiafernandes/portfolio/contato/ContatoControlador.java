package com.sophiafernandes.portfolio.contato;

import com.sophiafernandes.portfolio.recaptcha.ServicoRecaptcha;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Único motivo de o back-end existir na Sprint 02: a credencial do SMTP e a
 * secret key do reCAPTCHA não podem descer para o navegador.
 */
@RestController
@RequestMapping("/api")
public class ContatoControlador {

    private static final Logger log = LoggerFactory.getLogger(ContatoControlador.class);

    private final ServicoRecaptcha servicoRecaptcha;
    private final ServicoEmail servicoEmail;

    public ContatoControlador(ServicoRecaptcha servicoRecaptcha, ServicoEmail servicoEmail) {
        this.servicoRecaptcha = servicoRecaptcha;
        this.servicoEmail = servicoEmail;
    }

    @PostMapping("/contact")
    public Map<String, String> contato(@Valid @RequestBody ContatoRequisicao requisicao,
                                       HttpServletRequest http) {
        // Conferir o desafio antes de abrir conexão SMTP: o caminho mais curto
        // para recusar robô é não gastar o envio.
        servicoRecaptcha.validar(requisicao.tokenRecaptcha(), ipDe(http));
        servicoEmail.enviar(requisicao);
        log.info("Mensagem de contato enviada.");
        return Map.of("status", "enviado");
    }

    /**
     * No Render a aplicação fica atrás de proxy. Com
     * server.forward-headers-strategy=framework, o Spring já resolve o
     * X-Forwarded-For e getRemoteAddr devolve o IP de quem acessou.
     */
    private String ipDe(HttpServletRequest http) {
        return http.getRemoteAddr();
    }
}
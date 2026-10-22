package com.sophiafernandes.portfolio.contato;

import com.sophiafernandes.portfolio.recaptcha.ServicoRecaptcha;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * a credencial do SMTP e asecret key do reCAPTCHA não podem descer para o navegador.
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

    /**
     * A instancia gratuita do Render hiberna apos alguns minutos sem acesso, e
     * acordar leva perto de um minuto. Sem este toque antecipado, essa espera
     * caía inteira sobre quem clicava em enviar: o botao ficava parado,
     * parecendo travado, e o token do reCAPTCHA, que vale dois minutos, corria
     * risco de expirar antes de a requisicao chegar.
     */
    @GetMapping("/health")
    public Map<String, String> saude() {
        return Map.of("status", "ok");
    }

    @PostMapping("/contact")
    public Map<String, String> contato(@Valid @RequestBody ContatoRequisicao requisicao,

        servicoRecaptcha.validar(requisicao.tokenRecaptcha(), ipDe(http));
        servicoEmail.enviar(requisicao);
        log.info("Mensagem de contato enviada.");
        return Map.of("status", "enviado");
    }

    private String ipDe(HttpServletRequest http) {
        return http.getRemoteAddr();
    }
}
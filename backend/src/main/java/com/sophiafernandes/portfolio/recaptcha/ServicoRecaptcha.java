package com.sophiafernandes.portfolio.recaptcha;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Confere o token do reCAPTCHA v2 junto ao Google antes de deixar o envio passar. */
@Service
public class ServicoRecaptcha {

    private static final Logger log = LoggerFactory.getLogger(ServicoRecaptcha.class);

    private final RestClient cliente;
    private final PropriedadesRecaptcha propriedades;

    public ServicoRecaptcha(RestClient.Builder construtor, PropriedadesRecaptcha propriedades) {
        this.cliente = construtor.build();
        this.propriedades = propriedades;
    }

    /**
     * Valida o token. Passa em silêncio quando o reCAPTCHA está desligado.
     *
     * @param token token devolvido pelo widget no navegador
     * @param ip    IP de quem enviou, repassado ao Google como sinal extra
     * @throws RecaptchaInvalidoExcecao     token ausente, expirado ou recusado
     * @throws RecaptchaIndisponivelExcecao o serviço do Google não respondeu
     */
    public void validar(String token, String ip) {
        if (!propriedades.habilitado()) {
            log.debug("reCAPTCHA desligado: token não conferido.");
            return;
        }
        if (token == null || token.isBlank()) {
            throw new RecaptchaInvalidoExcecao("token ausente");
        }

        MultiValueMap<String, String> formulario = new LinkedMultiValueMap<>();
        formulario.add("secret", propriedades.secret());
        formulario.add("response", token);
        if (ip != null && !ip.isBlank()) {
            formulario.add("remoteip", ip);
        }

        Resposta resposta;
        try {
            resposta = cliente.post()
                    .uri(propriedades.urlVerificacao())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formulario)
                    .retrieve()
                    .body(Resposta.class);
        } catch (RestClientException excecao) {
            throw new RecaptchaIndisponivelExcecao("o serviço do reCAPTCHA não respondeu", excecao);
        }

        if (resposta == null || !resposta.success()) {
            List<String> codigos = resposta == null || resposta.codigosDeErro() == null
                    ? List.of()
                    : resposta.codigosDeErro();
            // Vale logar: 'invalid-input-secret' é erro de configuração, não de visitante.
            log.warn("reCAPTCHA recusou o token. Códigos: {}", codigos);
            throw new RecaptchaInvalidoExcecao("desafio não confirmado");
        }
    }

    /** Recorte do que o endpoint siteverify devolve. O resto do JSON não interessa. */
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Resposta(boolean success, @JsonProperty("error-codes") List<String> codigosDeErro) {
    }
}
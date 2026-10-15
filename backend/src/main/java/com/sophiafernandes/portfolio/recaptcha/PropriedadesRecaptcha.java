package com.sophiafernandes.portfolio.recaptcha;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuração do reCAPTCHA v2.
 *
 * O interruptor existe para o desenvolvimento local: sem ele, testar o
 * formulário na máquina exigiria resolver um desafio a cada envio. Em produção
 * fica ligado — é lá que o endpoint está exposto.
 *
 * A secret key só vive aqui. A site key, pública, fica no front-end.
 */
@ConfigurationProperties(prefix = "app.recaptcha")
public record PropriedadesRecaptcha(boolean habilitado, String secret, String urlVerificacao) {
}

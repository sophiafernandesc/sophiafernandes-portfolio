package com.sophiafernandes.portfolio.recaptcha;

/**
 * O serviço do Google não respondeu. Não é erro de quem preencheu o formulário,
 * então não vira 400 — vira 503, e a pessoa pode tentar de novo.
 */
public class RecaptchaIndisponivelExcecao extends RuntimeException {

    public RecaptchaIndisponivelExcecao(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

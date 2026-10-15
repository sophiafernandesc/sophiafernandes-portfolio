package com.sophiafernandes.portfolio.recaptcha;

/** Token ausente, expirado ou recusado pelo Google.*/
public class RecaptchaInvalidoExcecao extends RuntimeException {

    public RecaptchaInvalidoExcecao(String mensagem) {
        super(mensagem);
    }
}
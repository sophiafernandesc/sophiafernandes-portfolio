package com.sophiafernandes.portfolio.contato;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Para quem vai o e-mail do formulário e de qual caixa ele sai.
 *
 * O remetente precisa ser a mesma conta autenticada no SMTP — o Gmail recusa
 * mensagem cujo From não bate com o usuário da sessão.
 */
@ConfigurationProperties(prefix = "app.contato")
public record PropriedadesContato(String destinatario, String remetente) {
}


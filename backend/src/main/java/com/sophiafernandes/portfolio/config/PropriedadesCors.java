package com.sophiafernandes.portfolio.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Origens autorizadas a chamar a API.
 *
 * Em produção é só o apex sophiafernandes.dev — o www redireciona para ele
 * antes de qualquer requisição sair do navegador.
 */
@ConfigurationProperties(prefix = "app.cors")
public record PropriedadesCors(List<String> origens) {
}
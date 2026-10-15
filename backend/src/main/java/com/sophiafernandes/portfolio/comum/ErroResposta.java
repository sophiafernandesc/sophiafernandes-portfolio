package com.sophiafernandes.portfolio.comum;

import java.util.Map;

/**
 * Corpo de qualquer resposta de erro da API.
 *
 * A mensagem serve para depuração, não para a tela: o texto que a visitante lê
 * vem do i18next no front-end, que escolhe pelo status HTTP.
 *
 * @param mensagem o que deu errado, em uma linha
 * @param campos   erro por campo do formulário; vazio quando a falha não é de validação
 */
public record ErroResposta(String mensagem, Map<String, String> campos) {

    public ErroResposta(String mensagem) {
        this(mensagem, Map.of());
    }
}
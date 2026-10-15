package com.sophiafernandes.portfolio.contato;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Corpo do POST /api/contact.
 *
 * Os limites repetem os do formulário no front-end de propósito: o cliente é
 * público e pode ser contornado, então a validação que vale é esta.
 *
 * O nome entra no assunto do e-mail, por isso recusa quebra de linha — é o que
 * fecha a porta para injeção de cabeçalho SMTP.
 */
public record ContatoRequisicao(
        @NotBlank(message = "informe o nome")
        @Size(max = 100, message = "no máximo 100 caracteres")
        @Pattern(regexp = "[^\\r\\n]*", message = "sem quebras de linha")
        String nome,

        @NotBlank(message = "informe o e-mail")
        @Email(message = "e-mail inválido")
        @Size(max = 254, message = "no máximo 254 caracteres")
        String email,

        @NotBlank(message = "escreva a mensagem")
        @Size(max = 2000, message = "no máximo 2000 caracteres")
        String mensagem,

        /** Token do reCAPTCHA v2 gerado no navegador. Conferido no servidor. */
        String tokenRecaptcha
) {
}
package com.sophiafernandes.portfolio.recaptcha;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

/** Comportamento do serviço sem depender do Google de verdade. */
class ServicoRecaptchaTest {

    private static final String URL = "https://www.google.com/recaptcha/api/siteverify";

    private MockRestServiceServer servidor;

    /** Monta o serviço com um servidor HTTP simulado no lugar do siteverify. */
    private ServicoRecaptcha servicoCom(boolean habilitado) {
        RestClient.Builder construtor = RestClient.builder();
        servidor = MockRestServiceServer.bindTo(construtor).build();
        return new ServicoRecaptcha(construtor, new PropriedadesRecaptcha(habilitado, "segredo", URL));
    }

    @Test
    @DisplayName("desligado: passa direto e nem chama o Google")
    void desligado() {
        ServicoRecaptcha servico = servicoCom(false);

        assertThatCode(() -> servico.validar(null, "203.0.113.7")).doesNotThrowAnyException();

        servidor.verify();
    }

    @Test
    @DisplayName("ligado sem token: recusa antes de sair da aplicação")
    void tokenAusente() {
        ServicoRecaptcha servico = servicoCom(true);

        assertThatThrownBy(() -> servico.validar("  ", "203.0.113.7"))
                .isInstanceOf(RecaptchaInvalidoExcecao.class)
                .hasMessageContaining("ausente");

        servidor.verify();
    }

    @Test
    @DisplayName("success true: envia secret, token e IP, e deixa passar")
    void tokenAceito() {
        ServicoRecaptcha servico = servicoCom(true);
        servidor.expect(requestTo(URL))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().string("secret=segredo&response=abc&remoteip=203.0.113.7"))
                .andRespond(withSuccess("{\"success\":true}", MediaType.APPLICATION_JSON));

        assertThatCode(() -> servico.validar("abc", "203.0.113.7")).doesNotThrowAnyException();

        servidor.verify();
    }

    @Test
    @DisplayName("success false: recusa o envio")
    void tokenRecusado() {
        ServicoRecaptcha servico = servicoCom(true);
        servidor.expect(requestTo(URL)).andRespond(withSuccess(
                "{\"success\":false,\"error-codes\":[\"timeout-or-duplicate\"]}",
                MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> servico.validar("abc", null))
                .isInstanceOf(RecaptchaInvalidoExcecao.class);

        servidor.verify();
    }

    @Test
    @DisplayName("Google fora do ar: vira indisponível, não token inválido")
    void servicoFora() {
        ServicoRecaptcha servico = servicoCom(true);
        servidor.expect(requestTo(URL)).andRespond(withServerError());

        assertThatThrownBy(() -> servico.validar("abc", null))
                .isInstanceOf(RecaptchaIndisponivelExcecao.class);

        servidor.verify();
    }
}
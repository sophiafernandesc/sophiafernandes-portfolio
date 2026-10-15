package com.sophiafernandes.portfolio.contato;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sophiafernandes.portfolio.config.PropriedadesCors;
import com.sophiafernandes.portfolio.recaptcha.RecaptchaIndisponivelExcecao;
import com.sophiafernandes.portfolio.recaptcha.RecaptchaInvalidoExcecao;
import com.sophiafernandes.portfolio.recaptcha.ServicoRecaptcha;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Contrato do POST /api/contact: o que entra, o que sai e com qual status. */
@WebMvcTest(ContatoControlador.class)
// A fatia web carrega o WebMvcConfigurer do CORS, logo precisa das origens.
@EnableConfigurationProperties(PropriedadesCors.class)
class ContatoControladorTest {

    private static final String VALIDO = """
            {
              "nome": "Sophia Fernandes",
              "email": "sophia@exemplo.dev",
              "mensagem": "Olá! Vi seu portfólio.",
              "tokenRecaptcha": "token-valido"
            }
            """;

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ServicoRecaptcha servicoRecaptcha;

    @MockitoBean
    private ServicoEmail servicoEmail;

    @Test
    @DisplayName("mensagem válida é enviada e responde 200")
    void mensagemValida() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALIDO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("enviado"));

        verify(servicoRecaptcha).validar(eq("token-valido"), any());
        verify(servicoEmail).enviar(any(ContatoRequisicao.class));
    }

    @Test
    @DisplayName("nome em branco responde 400 e aponta o campo")
    void nomeEmBranco() throws Exception {
        String corpo = """
                {"nome": "  ", "email": "sophia@exemplo.dev", "mensagem": "Olá"}
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists());

        verify(servicoEmail, never()).enviar(any());
    }

    @Test
    @DisplayName("e-mail malformado responde 400 e aponta o campo")
    void emailMalformado() throws Exception {
        String corpo = """
                {"nome": "Sophia", "email": "sophia(arroba)exemplo", "mensagem": "Olá"}
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.email").exists());

        verify(servicoEmail, never()).enviar(any());
    }

    @Test
    @DisplayName("nome com quebra de linha responde 400: fecha injeção de cabeçalho")
    void nomeComQuebraDeLinha() throws Exception {
        String corpo = """
                {"nome": "Sophia\\nBcc: alguem@exemplo.com", "email": "s@exemplo.dev", "mensagem": "Olá"}
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists());

        verify(servicoEmail, never()).enviar(any());
    }

    @Test
    @DisplayName("reCAPTCHA recusado responde 400 e não gasta envio")
    void recaptchaRecusado() throws Exception {
        doThrow(new RecaptchaInvalidoExcecao("desafio não confirmado"))
                .when(servicoRecaptcha).validar(any(), any());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALIDO))
                .andExpect(status().isBadRequest());

        verify(servicoEmail, never()).enviar(any());
    }

    @Test
    @DisplayName("reCAPTCHA fora do ar responde 503, não 400")
    void recaptchaIndisponivel() throws Exception {
        doThrow(new RecaptchaIndisponivelExcecao("sem resposta", new RuntimeException()))
                .when(servicoRecaptcha).validar(any(), any());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALIDO))
                .andExpect(status().isServiceUnavailable());

        verify(servicoEmail, never()).enviar(any());
    }

    @Test
    @DisplayName("falha de SMTP responde 502")
    void smtpFalhou() throws Exception {
        doThrow(new MailSendException("sem credencial")).when(servicoEmail).enviar(any());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(VALIDO))
                .andExpect(status().isBadGateway());
    }

    @Test
    @DisplayName("JSON quebrado responde 400")
    void jsonQuebrado() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest());
    }
}
package com.sophiafernandes.portfolio.comum;

import com.sophiafernandes.portfolio.recaptcha.RecaptchaIndisponivelExcecao;
import com.sophiafernandes.portfolio.recaptcha.RecaptchaInvalidoExcecao;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduz exceção em status HTTP.
 *
 * A separação que importa: erro de quem preencheu o formulário é 4xx e não deve
 * virar alarme; falha de SMTP ou do reCAPTCHA é 5xx, porque o problema é nosso
 * e a pessoa pode tentar de novo.
 */
@RestControllerAdvice
public class TratadorDeErros {

    private static final Logger log = LoggerFactory.getLogger(TratadorDeErros.class);

    /** Campo em branco, e-mail malformado, mensagem longa demais. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException excecao) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : excecao.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(new ErroResposta("dados inválidos", campos));
    }

    /** JSON quebrado ou corpo ausente. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResposta> corpoIlegivel(HttpMessageNotReadableException excecao) {
        return ResponseEntity.badRequest().body(new ErroResposta("corpo da requisição ilegível"));
    }

    @ExceptionHandler(RecaptchaInvalidoExcecao.class)
    public ResponseEntity<ErroResposta> recaptchaInvalido(RecaptchaInvalidoExcecao excecao) {
        return ResponseEntity.badRequest().body(new ErroResposta("reCAPTCHA: " + excecao.getMessage()));
    }

    @ExceptionHandler(RecaptchaIndisponivelExcecao.class)
    public ResponseEntity<ErroResposta> recaptchaIndisponivel(RecaptchaIndisponivelExcecao excecao) {
        log.error("Verificação do reCAPTCHA falhou.", excecao);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErroResposta("verificação indisponível, tente novamente"));
    }

    /** Credencial errada, servidor fora, caixa recusando a mensagem. */
    @ExceptionHandler(MailException.class)
    public ResponseEntity<ErroResposta> envioFalhou(MailException excecao) {
        log.error("SMTP recusou o envio.", excecao);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ErroResposta("não foi possível enviar o e-mail"));
    }
}
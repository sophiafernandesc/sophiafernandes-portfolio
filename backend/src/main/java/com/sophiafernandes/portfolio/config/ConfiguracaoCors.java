package com.sophiafernandes.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfiguracaoCors implements WebMvcConfigurer {

    private static final long VALIDADE_DO_PREFLIGHT_EM_SEGUNDOS = 3600;

    private final PropriedadesCors propriedades;

    public ConfiguracaoCors(PropriedadesCors propriedades) {
        this.propriedades = propriedades;
    }

    @Override
    public void addCorsMappings(CorsRegistry registro) {
        registro.addMapping("/api/**")
                .allowedOrigins(propriedades.origens().toArray(String[]::new))
                .allowedMethods("GET", "POST")
                .allowedHeaders("Content-Type")
                .maxAge(VALIDADE_DO_PREFLIGHT_EM_SEGUNDOS);
    }
}
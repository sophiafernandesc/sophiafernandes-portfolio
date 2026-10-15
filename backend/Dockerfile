# Build e execucao do back-end para o Render.
#
# Java nao e runtime nativo do Render, e a versao 25 e recente demais para
# depender do que a plataforma oferece. Com Docker a JDK e escolha nossa.

FROM eclipse-temurin:25-jdk AS construcao
WORKDIR /app

# As dependencias entram antes do codigo de proposito: assim o cache sobrevive
# a cada alteracao em src/ e o build seguinte nao rebaixa o Maven inteiro.
# O '|| true' evita que uma resolucao parcial derrube o build: o que faltar o
# package busca depois.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline || true

COPY src/ src/
# Os testes ja rodam na maquina; aqui eles so alongariam o deploy.
RUN ./mvnw -B clean package -DskipTests


FROM eclipse-temurin:25-jre AS execucao
WORKDIR /app

# Usuario sem privilegio: se algo escapar, nao escapa como root.
RUN useradd --create-home --shell /bin/bash portfolio
USER portfolio

COPY --from=construcao /app/target/portfolio-*.jar aplicacao.jar

# O Render injeta PORT, e o application.properties ja usa ${PORT:8080}.
EXPOSE 8080

# A instancia gratuita tem 512 MB. Sem este limite a JVM assume 1/4 do total
# como heap maximo e desperdica metade da memoria disponivel.
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "aplicacao.jar"]

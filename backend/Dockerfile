FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
# Dependencies resolve in their own layer, so a source-only change reuses it.
COPY pom.xml .
# Error Prone runs inside javac and needs the jdk.compiler exports in jvm.config.
COPY .mvn/jvm.config .mvn/
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]

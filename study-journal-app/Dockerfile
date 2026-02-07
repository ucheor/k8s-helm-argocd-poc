# Stage 1: Build WAR with Maven
FROM maven:3.8.6-openjdk-11-slim AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime with Tomcat
FROM tomcat:9-jdk11-openjdk-slim
COPY --from=builder /build/target/mood-journal.war /usr/local/tomcat/webapps/ROOT.war
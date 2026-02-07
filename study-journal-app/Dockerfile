# Stage 1: Build WAR with Maven
FROM maven:3.8.6-openjdk-11-slim AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime with Tomcat
FROM tomcat:9.0.73-jdk11-temurin

# Remove default ROOT app
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy and extract WAR
COPY --from=builder /build/target/mood-journal.war /usr/local/tomcat/webapps/ROOT.war

# Ensure proper permissions
RUN chmod -R 755 /usr/local/tomcat/webapps/

# Expose port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
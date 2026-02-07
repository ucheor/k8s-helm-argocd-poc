FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the JAR file
COPY target/restaurant-order-app-1.0.0.jar app.jar

# Expose port 3100
EXPOSE 3100

# Run the application
CMD ["java", "-jar", "app.jar"]
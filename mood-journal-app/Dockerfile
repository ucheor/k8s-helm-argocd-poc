FROM tomcat:9.0-jdk11-openjdk-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY . /usr/local/tomcat/webapps/mood-journal/

# Create necessary directory structure
#RUN mkdir -p /usr/local/tomcat/webapps/mood-journal/{css,js}

# Set proper permissions
#RUN chmod -R 755 /usr/local/tomcat/webapps/mood-journal

# Expose port 8080
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
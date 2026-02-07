# Use nginx alpine for a lightweight image
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our focus timer app
COPY focus-timer-final.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 8081

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
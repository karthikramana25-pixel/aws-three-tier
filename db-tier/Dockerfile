FROM mysql:5.7

# Set proper MySQL settings
ENV MYSQL_ROOT_PASSWORD=admin123
ENV MYSQL_DATABASE=webappdb

# Improve MySQL connectivity for Node.js
ENV MYSQL_ROOT_HOST=%

# Copy initialization SQL script
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306


# ---------- Stage 1: Build React ----------
FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies normally
RUN npm install --legacy-peer-deps

# Force React Scripts compatible AJV version
RUN npm install ajv@6 ajv-keywords@3 --legacy-peer-deps

# Copy full source code
COPY . .

# Build React
RUN npx react-scripts build


# ---------- Stage 2: Nginx ----------
FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html/

COPY ssl/ /etc/nginx/ssl/

RUN printf "proxy_set_header Host \$host;\n\
proxy_set_header X-Real-IP \$remote_addr;\n\
proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n\
proxy_set_header X-Forwarded-Proto \$scheme;\n\
proxy_http_version 1.1;\n\
proxy_set_header Connection \"\";\n" \
> /etc/nginx/proxy_params

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]


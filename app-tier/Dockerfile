# --------------------------------------------------------
# Use Node.js 16 (same as your NVM setup)
# --------------------------------------------------------
FROM node:16-slim

# Create app directory
WORKDIR /app

# --------------------------------------------------------
# Install pm2 globally
# --------------------------------------------------------
RUN npm install -g pm2

# --------------------------------------------------------
# Copy package files and install dependencies
# --------------------------------------------------------
COPY package.json ./
RUN npm install --legacy-peer-deps

# --------------------------------------------------------
# Copy application source code
# --------------------------------------------------------
COPY . .

# Expose backend port
EXPOSE 4000

# --------------------------------------------------------
# Start the application using PM2
# --------------------------------------------------------
CMD ["pm2-runtime", "index.js"]


FROM node:20

# Set environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies (ignoring development devDependencies if any)
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend PORT
EXPOSE 8000

# Start server
CMD ["node", "src/server.js"]

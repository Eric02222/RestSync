FROM node:20

WORKDIR /usr/src/app

# Copy dependency configs
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port used by Vite
EXPOSE 8000

# Start Vite dev server on port 8000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8000"]

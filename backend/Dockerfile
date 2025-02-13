# Use Node.js official image
FROM node:20

# Install dependencies for libvips and libheif
RUN apt-get update && apt-get install -y \
    libvips-dev \
    libheif-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the server port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]

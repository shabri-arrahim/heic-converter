# Use Node.js official image
FROM node:20-bullseye

# Install dependencies for libvips and libheif
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    libheif-dev \
    build-essential \
    pkg-config \
    libglib2.0-dev \
    libexpat1-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean \
    && rm -rf /tmp/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the server
CMD ["node", "server.js"]
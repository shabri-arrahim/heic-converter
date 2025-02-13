# Use Node.js official image
# Use an official lightweight Node.js image
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

COPY package*.json /app/

RUN npm install --omit=dev --include=optional sharp

COPY . /app

# Start the server
RUN node server.js
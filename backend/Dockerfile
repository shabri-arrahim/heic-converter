# Use Node.js official image
FROM node:20-bullseye

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    meson \
    ninja-build \
    pkg-config \
    libglib2.0-dev \
    libexpat1-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libgif-dev \
    libde265-dev \
    libheif-dev \
    && rm -rf /var/lib/apt/lists/*

# Install latest libvips from source (8.14+)
RUN curl -fsSL https://github.com/libvips/libvips/releases/download/v8.14.1/vips-8.14.1.tar.gz | tar xz \
    && cd vips-8.14.1 \
    && ./configure --prefix=/usr --enable-shared \
    && make -j$(nproc) \
    && make install \
    && ldconfig \
    && cd .. && rm -rf vips-*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (sharp will use system-installed libvips)
RUN npm install --ignore-scripts \
    && npm rebuild sharp --verbose --with-libvips

# Copy the rest of the application code
COPY . .

# Start the server
CMD ["node", "server.js"]

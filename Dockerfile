FROM node:20-slim

# Install ImageMagick with HEIC support
RUN apt-get update && apt-get install -y \
  imagemagick \
  libheif1 \
  libheif-dev \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
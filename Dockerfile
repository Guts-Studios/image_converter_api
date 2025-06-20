FROM node:20-slim

# Install necessary tools and libraries for Sharp + HEIC
RUN apt-get update && apt-get install -y \
  libheif-dev \
  libx265-dev \
  libde265-dev \
  libaom-dev \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Rebuild sharp to use system libheif
RUN npm rebuild sharp

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
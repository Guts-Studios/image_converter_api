FROM node:20-slim

# Install HEIF/HEIC support libraries and codecs
RUN apt-get update && apt-get install -y \
  libheif-dev \
  libheif1 \
  heif-gdk-pixbuf \
  heif-thumbnailer \
  libx265-dev \
  libde265-dev \
  libaom-dev \
  libdav1d-dev \
  librav1e-dev \
  libsvtav1-dev \
  build-essential \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# CRITICAL: Rebuild sharp with system libraries
RUN npm rebuild sharp --verbose

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
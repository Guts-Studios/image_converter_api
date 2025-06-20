FROM node:20-slim

# Install necessary tools and libraries
RUN apt-get update && apt-get install -y \
  ffmpeg \
  libheif-dev \
  libx265-dev \
  libde265-dev \
  libaom-dev \
  wget \
  curl \
  ca-certificates \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Expose port (if using Express or similar)
EXPOSE 3000

# Start server
CMD ["node", "index.js"]

# Use Node.js as the base image
FROM node:20

# Install ffmpeg with HEIC support
RUN apt-get update && \
    apt-get install -y ffmpeg libheif-dev libde265-0 libx265-dev && \
    apt-get clean

# Create app directory
WORKDIR /app

# Copy app files and install dependencies
COPY . .
RUN npm install

# Expose app port
EXPOSE 3000

# Start app
CMD ["node", "index.js"]

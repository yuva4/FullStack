# Use official Node.js image
FROM node:18

# Install required compilers/interpreters
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    openjdk-17-jdk \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json first and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose compiler server port
EXPOSE 8000

# Start the compiler server
CMD ["node", "server.js"]

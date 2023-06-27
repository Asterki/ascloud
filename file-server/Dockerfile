# Use the official Node.js Docker image as the base image.
# Set the desired Node.js version using the build argument.
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}

# Set the working directory for the application.
WORKDIR /home/user/app

# Create the folders
RUN mkdir -p /app/file-server
RUN mkdir -p /app/shared

# Set the working directory
WORKDIR /app/file-server

# Copy the application code
COPY . .

# Copy the shared folder
COPY ../shared /app/shared

# Copy the package.json and package-lock.json files.
COPY package*.json ./

# Install dependencies for production.
RUN npm ci --production

# Install development dependencies and global TypeScript compiler.
RUN npm ci --only=development \
    && npm install -g typescript

# Build the TypeScript files.
RUN npm run start:clean\
    && npm run start:build-server

# Expose the necessary port(s).
EXPOSE 8080

# Set the command to run the application.
CMD npm run start:run-server

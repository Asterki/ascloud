# Use the official Node.js Docker image as the base image.
# Set the desired Node.js version using the build argument.
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}

# Set the working directory for the application.
WORKDIR /home/user/app

# Copy the application code.
COPY . ./web-client
COPY ../shared/ ./shared

WORKDIR /home/user/app/web-client

# Copy the package.json and package-lock.json files.
COPY package*.json ./

# Install dependencies for production.
RUN npm ci --production

# Install development dependencies and global TypeScript compiler.
RUN npm ci --only=development \
    && npm install -g typescript

# Build the TypeScript files.
RUN npm run start:clean\
    && npm run start:build-server\
    && npm run start:build-client

# Expose the necessary port(s).
EXPOSE 3030

# Set the command to run the application.
CMD npm run start:run-server

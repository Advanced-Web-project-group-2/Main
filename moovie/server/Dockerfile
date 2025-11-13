# Use Node.js base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your server code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]


# Use official Node.js image
FROM node:18

# Build frontend
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build backend
WORKDIR /server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Expose the port for Railway (default is 3000, but your code listens on process.env.PORT)
EXPOSE 3000

# Start backend
CMD ["npm", "start"]
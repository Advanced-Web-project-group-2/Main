# Use official Node.js image (upgraded to Node 20 for Vite 7 compatibility)
FROM node:20

# Build frontend
WORKDIR /app/client
COPY moovie/client/package*.json ./
RUN npm install
# Install axios which is missing from package.json but used in the code
RUN npm install axios
COPY moovie/client/ ./
RUN npm run build

# Setup backend
WORKDIR /app/server
COPY moovie/server/package*.json ./
RUN npm install
COPY moovie/server/ ./

# Copy built frontend to where server expects it
RUN mkdir -p /app/server/client/dist
RUN cp -r /app/client/dist/* /app/server/client/dist/

# Expose the port for Railway
EXPOSE 3000

# Start backend from the src directory
WORKDIR /app/server/src
CMD ["node", "index.js"]
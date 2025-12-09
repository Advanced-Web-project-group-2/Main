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

# Copy raw client assets so image URLs like /src/assets/... work in production
COPY moovie/client/src/assets /app/server/assets

# Copy built frontend to where server expects it
RUN mkdir -p /app/server/client/dist
RUN cp -r /app/client/dist/* /app/server/client/dist/

# Expose the port for Railway
EXPOSE 3000

# Start backend - stay in /app/server and run src/index.js
WORKDIR /app/server
CMD ["node", "src/index.js"]
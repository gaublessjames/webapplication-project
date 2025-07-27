FROM node:20-alpine

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port Vite will run on
EXPOSE 8080

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"] 
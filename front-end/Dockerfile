FROM --platform=linux/arm64 node:20-alpine

WORKDIR /app

# Copy only package.json and lock file first for better caching
COPY package.json package-lock.json ./

# Install dependencies inside the container (native to ARM64)
RUN npm install

# Now copy the rest of your code
COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev", "--", "--host", "--port", "8081"] 
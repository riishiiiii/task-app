# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json  ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

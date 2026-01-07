# Use a base image (e.g., Node, Java, Python, etc.)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy application files from the Jenkins workspace into the container image
COPY . .

# Install dependencies (example for a Node.js project)
RUN npm install --production

# Define the command to run when the container starts
CMD ["node", "main.js"]

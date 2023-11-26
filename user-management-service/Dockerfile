# Use an official Node runtime as a base image
FROM node:21.1.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
# --force to ensure bcrypt is compiled for the Linux environment
RUN npm install --force

# Bundle app source
COPY . .

# Make port 3001 available outside this container
EXPOSE 3001

# Define the command to run your app
CMD [ "npm", "start" ]

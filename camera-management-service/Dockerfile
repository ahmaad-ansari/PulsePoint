# Use an official Node runtime as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port 3002 available outside this container
EXPOSE 3002

# Define the command to run your app
CMD [ "npm", "start" ]

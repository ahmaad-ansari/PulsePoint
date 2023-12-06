# User Management Service

This service manages user-related operations, including registration and authentication. It provides endpoints for user registration, login, and authentication using JSON Web Tokens (JWT).

## Prerequisites

- Node.js installed
- MongoDB installed and running
- `.env` file with configuration (see `.env.example`)

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and set the required environment variables.
4. Start the server: `npm start`

## Project Structure

- **`/models`**: Contains Mongoose models (e.g., `User.js`) for MongoDB.
- **`/routes`**: Defines API endpoints for user-related operations.
- **`/middleware`**: Custom middleware functions, like authentication middleware (`auth.js`).
- **`server.js`**: Entry point of the application.

## Available Scripts

- `npm start`: Starts the server.
- `npm run dev`: Starts the server in development mode using nodemon.
- `npm test`: Runs the test suite.

## Endpoints

### User Registration

- **Endpoint**: `/users/register`
- **Method**: `POST`
- **Request Body**:
  - `firstName`: First name of the user
  - `lastName`: Last name of the user
  - `username`: Username for authentication
  - `email`: Email address of the user
  - `password`: Password for authentication
- **Response**: Success message or error if registration fails.

### User Login

- **Endpoint**: `/users/login`
- **Method**: `POST`
- **Request Body**:
  - `username`: Username for authentication
  - `password`: Password for authentication
- **Response**: JWT token for successful login, user details (ID, name, email, username).

### User Authentication

- **Middleware**: `auth.js`
- Validates JWT token sent in the `Authorization` header.
- Protects routes that require authentication.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **JSON Web Tokens (JWT)**: For authentication and authorization
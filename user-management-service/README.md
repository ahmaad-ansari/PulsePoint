# User Management Service

This service handles user registration and login functionalities, storing user information securely in a MongoDB database and providing authentication using JSON Web Tokens (JWT) and bcrypt.

## Features

- **User Registration**: Allows users to register by providing their first name, last name, username, email, and password.
- **User Login**: Authenticates users using JWT and bcrypt, providing access to authorized endpoints.
- **Token Expiry**: JWT tokens expire after 1 hour for enhanced security.

## Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and provide the connection URI in the `.env` file.
4. Run the service using `npm start`.

## Usage

### Register a User

```http
POST /users/register
```

Provide the following fields in the request body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### User Login

```http
POST /users/login
```
Provide the following fields in the request body to receive a JWT token for authentication:

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

## Environment Variables

Create a `.env` file in the root directory and include the following variables:

- `PORT`: Port number for the server
- `MONGO_URI`: MongoDB connection URI
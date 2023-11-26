# Camera Management Service

This service handles camera registration and update functionalities, storing camera information securely in a MongoDB database.

## Features

- **Camera Registration**: Allows a camera to be added to the server.
- **Camera Deletion**: Allows for the removal of a camera on the server.

## Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and provide the connection URI in the `.env` file.
4. Run the service using `npm start`.

## Usage

### Register a Camera

```http
POST /cameras/
```

Provide the following fields in the request body:

```json
{
  "name": "Camera 1",
  "ipAddress": "127.0.1.1:5000",
  "location": "Entryway",
  "streamURL": "http://127.0.1.1:5000/video_feed",
}
```

## Environment Variables

Create a `.env` file in the root directory and include the following variables:

- `PORT`: Port number for the server
- `MONGO_URI`: MongoDB connection URI
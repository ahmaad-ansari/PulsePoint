# Video Storage Service

This service handles the storage, retrieval, and management of video files captured by cameras. It includes endpoints for uploading, retrieving, and deleting video files, as well as streaming videos.

## Setup

1. **Dependencies**:
   - Node.js
   - MongoDB
   - Required Node packages (`express`, `mongoose`, `multer`)

2. **Installation**:
   - Clone the repository and navigate to the project directory.
   - Install dependencies using `npm install`.

3. **Environment Variables**:
   - Create a `.env` file and configure MongoDB connection details:
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=3003
     ```

4. **Starting the Server**:
   - Run `npm start` to start the server.
   - The service will run on `http://localhost:3003`.

## Endpoints

### `POST /videos/upload`
- **Description**: Uploads a video file.
- **Request**: Requires a video file in the `video` field of a `multipart/form-data` request. Additional metadata includes `cameraId`.
- **Response**: Returns the uploaded video metadata and a list of all videos.

### `GET /videos`
- **Description**: Retrieves a list of all videos.
- **Response**: Returns an array of video metadata.

### `POST /videos/videosByCameraIds`
- **Description**: Retrieves videos based on specified camera IDs.
- **Request**: Requires an array of `cameraIds`.
- **Response**: Returns an array of video metadata.

### `GET /videos/:id`
- **Description**: Downloads a specific video file by ID.
- **Response**: Streams the video file.

### `GET /video/:videoId`
- **Description**: Streams a specific video file by video ID.
- **Response**: Streams the video file with range support.

### `DELETE /videos/:id`
- **Description**: Deletes a specific video file by ID.
- **Response**: Returns the deleted video metadata and an updated list of videos.

### `GET /storage/:filename`
- **Description**: Serves static files (videos) stored in the `storage` directory.

## Usage

- Use appropriate endpoints for uploading, retrieving, streaming, and deleting videos.
- Ensure proper authentication and authorization mechanisms are implemented for these endpoints.
- Adjust file storage configurations, such as the storage directory and file naming conventions, as needed.

## Notes

- For file streaming, the server supports range requests to efficiently handle video streaming.
- Handle errors gracefully and provide appropriate status codes and error messages for each endpoint.
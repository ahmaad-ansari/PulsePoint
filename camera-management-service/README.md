# Camera Management Service

The Camera Management Service provides functionalities to manage cameras, including adding, updating, assigning users, and accessing camera streams.

## Installation

1. **Clone the repository**
    ```bash
    git clone <repository_url>
    cd camera-management-service
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    - Create a `.env` file based on `.env.example` and set necessary environment variables, such as `PORT`, `MONGO_URI`, and `JWT_SECRET`.

4. **Start the server**
    ```bash
    npm start
    ```

## Endpoints

### Add a Camera
- **Endpoint**: `POST /cameras`
- **Description**: Add a new camera to the system.
- **Request Body**:
    ```json
    {
        "name": "Camera Name",
        "ipAddress": "192.168.1.100",
        "location": "Living Room",
        "streamUrl": "http://camera-stream-url"
    }
    ```
- **Response**: Newly added camera object

### Fetch Cameras Not Assigned to User
- **Endpoint**: `GET /cameras/not-assigned/:userId`
- **Description**: Fetch cameras not assigned to a specific user.
- **Response**: List of cameras not assigned to the user

### Fetch Cameras Assigned to User
- **Endpoint**: `GET /cameras/assigned/:userId`
- **Description**: Fetch cameras assigned to a specific user.
- **Response**: List of cameras assigned to the user

### Get All Cameras
- **Endpoint**: `GET /cameras`
- **Description**: Fetch all cameras in the system.
- **Response**: List of all cameras

### Update a Camera
- **Endpoint**: `PATCH /cameras/:id`
- **Description**: Update details of a specific camera by its ID.
- **Request Body**: Updated camera details
- **Response**: Updated camera object

### Remove User from Camera
- **Endpoint**: `DELETE /cameras/:cameraId/removeUser/:userId`
- **Description**: Remove a user from a specific camera's assigned users.
- **Response**: Confirmation message and updated camera details

### Delete a Camera
- **Endpoint**: `DELETE /cameras/:id`
- **Description**: Delete a specific camera by its ID.
- **Response**: Deleted camera object

### Add User to Camera
- **Endpoint**: `POST /cameras/:cameraId/addUser`
- **Description**: Add a single user to a specific camera.
- **Request Body**: { "userId": "user_id" }
- **Response**: Confirmation message

### Access Camera Stream
- **Endpoint**: `GET /cameras/stream/:cameraId`
- **Description**: Access the live stream of a specific camera.
- **Response**: Live camera stream (video)

## Authentication

The service uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, include a valid JWT token in the Authorization header as `Bearer <token>`.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- SSDP (Simple Service Discovery Protocol)

Feel free to explore and use the endpoints to manage cameras effectively.

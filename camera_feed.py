import requests  # Importing necessary libraries
from flask import Flask, Response
import cv2
import socket

app = Flask(__name__)  # Initializing Flask app
camera = cv2.VideoCapture(0)  # Accessing the default camera

SERVER_URL = "http://10.0.0.127:3002"  # Server URL for communication

# Function to register the camera with the server
def register_camera():
    ip_address = get_local_ip_address()  # Fetching the local IP address
    camera_data = {
        "name": "Jetson",
        "location": "Jetson Device",
        "ipAddress": f"{ip_address}",
        "streamUrl": f"http://{ip_address}:5000/video_feed"  # Camera stream URL
    }
    try:
        response = requests.post(f"{SERVER_URL}/cameras", json=camera_data)  # Sending camera data to the server
        print("Response from server:", response.status_code, response.text)  # Logging server response
    except requests.exceptions.RequestException as e:
        print("Error connecting to server:", e)  # Logging connection error with the server

# Generator function to capture video frames from the camera
def generate_frames():
    while True:
        success, frame = camera.read()  # Reading frames from the camera
        if not success:
            break
        ret, buffer = cv2.imencode('.jpg', frame)  # Encoding frames as JPEG
        frame = buffer.tobytes()  # Converting frames to bytes
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # Yielding frames as a response

# Route for accessing the video feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')  # Streaming frames as a response

# Function to fetch the local IP address
def get_local_ip_address():
    try:
        temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        temp_socket.connect(("8.8.8.8", 80))
        local_ip_address = temp_socket.getsockname()[0]  # Fetching the local IP address
        temp_socket.close()
        return local_ip_address  # Returning the IP address
    except Exception as e:
        print("Error fetching IP address:", e)  # Logging error in fetching IP address
        return None

if __name__ == '__main__':
    register_camera()  # Registering the camera with the server
    app.run(host='0.0.0.0', port=5000, ssl_context='adhoc')  # Running the Flask app

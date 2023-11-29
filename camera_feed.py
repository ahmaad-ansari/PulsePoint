import requests
from flask import Flask, Response
import cv2
import socket

app = Flask(__name__)
camera = cv2.VideoCapture(0)  # Use the default camera
SERVER_URL = "http://10.0.0.127:3002"

def register_camera():
    ip_address = get_local_ip_address()
    camera_data = {
        "name": "Jetson",
        "location": "Jetson Device",
        "ipAddress": f"{ip_address}",
        "streamUrl": f"http://{ip_address}:5000/video_feed"
    }
    try:
        response = requests.post(f"{SERVER_URL}/cameras", json=camera_data)
        print("Response from server:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Error connecting to server:", e)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def get_local_ip_address():
    try:
        temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        temp_socket.connect(("8.8.8.8", 80))
        local_ip_address = temp_socket.getsockname()[0]
        temp_socket.close()
        return local_ip_address
    except Exception as e:
        print("Error fetching IP address:", e)
        return None

if __name__ == '__main__':
    register_camera()
    app.run(host='0.0.0.0', port=5000, ssl_context='adhoc')

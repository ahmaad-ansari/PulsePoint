import requests
from flask import Flask, Response
import cv2
import socket

app = Flask(__name__)
camera = cv2.VideoCapture(0)  # Use the default camera

def register_camera():
    ip_address = get_local_ip_address()
    camera_data = {
        "name": "Jetson",
        "ipAddress": ip_address,
        "location": "Jetson Device",
        "streamUrl": "http://{}:5000/video_feed".format(ip_address)
    }
    requests.post("http://10.0.0.2:3002/cameras", json=camera_data)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def get_local_ip_address():
    try:
        # Create a UDP socket to get the local IP address
        temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        temp_socket.connect(("8.8.8.8", 80))  # Connect to a public DNS server
        local_ip_address = temp_socket.getsockname()[0]  # Get the local IP address
        temp_socket.close()
        return local_ip_address
    except Exception as e:
        print("Error fetching IP address:", e)
        return None


if __name__ == '__main__':
    register_camera()
    app.run(host='0.0.0.0', port=5000)


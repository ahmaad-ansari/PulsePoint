import cv2
import numpy as np
import requests
import threading
import datetime
import os
import time


class CameraProcessor:
    def __init__(self, camera_data):
        self.camera_id = camera_data['_id']  # Updated line
        self.stream_url = camera_data['streamUrl']
        self.camera_name = camera_data['name']
        self.camera_location = camera_data['location']
        self.backSub = cv2.createBackgroundSubtractorMOG2()
        self.is_recording = False

    def record_video(self, initial_frame):
        # Function to record video upon detecting motion
        
        # Initialize variables for motion detection
        max_post_motion_duration = 2  # seconds
        last_motion_time = datetime.datetime.now()

        # Create directory for recordings if it doesn't exist
        recordings_dir = 'recordings'
        if not os.path.exists(recordings_dir):
            os.makedirs(recordings_dir)

        # Define file path and name for the recorded video
        sanitized_url = self.stream_url.replace('://', '_').replace('/', '_')
        filename = f"motion_{sanitized_url}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
        filepath = os.path.join(recordings_dir, filename)

        # Initialize video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(filepath, fourcc, 20.0, (640, 480))

        # Write initial frame upon motion detection
        out.write(initial_frame)

        # Loop to continuously capture frames and record the video
        for frame in self.read_stream():
            current_time = datetime.datetime.now()

            # Check for motion detection in the frame
            if self.is_motion_detected(frame):
                print("Motion is detected from ", self.stream_url)
                last_motion_time = current_time  # Update the last motion time

            # Stop recording if no motion detected for a certain duration
            if (current_time - last_motion_time).seconds > max_post_motion_duration:
                break

            out.write(frame)

        # Release video writer and upload the recorded video
        out.release()
        self.is_recording = False
        self.upload_video(filepath)

    # Function to detect motion in the frame
    def is_motion_detected(self, frame):
        fg_mask = self.backSub.apply(frame)
        _, thresh = cv2.threshold(fg_mask, 25, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for contour in contours:
            if cv2.contourArea(contour) > 500:
                return True
        return False

    # Function to read frames from the stream
    def read_stream(self):
        stream = requests.get(self.stream_url, stream=True)
        byte_stream = bytes()
        for chunk in stream.iter_content(chunk_size=1024):
            byte_stream += chunk
            a = byte_stream.find(b'\xff\xd8')
            b = byte_stream.find(b'\xff\xd9')
            if a != -1 and b != -1:
                jpg = byte_stream[a:b + 2]
                byte_stream = byte_stream[b + 2:]
                frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                yield frame

    # Function to continuously process the stream for motion detection
    def process_stream(self):
        for frame in self.read_stream():
            if frame is None:
                break
            if not self.is_recording and self.is_motion_detected(frame):
                self.is_recording = True
                threading.Thread(target=self.record_video, args=(frame,)).start()

    # Function to upload the recorded video
    def upload_video(self, filepath):
        url = 'http://localhost:3003/videos/upload'  # Update with your video upload endpoint
        filename = os.path.basename(filepath)
        files = {'video': (filename, open(filepath, 'rb'), 'video/mp4')}  # Adjust content type if needed
        data = {
            'cameraId': self.camera_id,
            'name': self.camera_name,
            'location': self.camera_location,
            'streamUrl': self.stream_url
        }

        try:
            response = requests.post(url, files=files, data=data)
            print(f"Video uploaded: {response.status_code}, Response: {response.text}")
        except requests.RequestException as e:
            print(f"Error uploading video: {e}")
        finally:
            files['video'][1].close()  # Close the file handle
            os.remove(filepath)  # Remove the file after uploading

    # Function to stop camera processing
    def stop(self):
        self.active = False  # Set a flag to stop the camera processing


def fetch_cameras():
    # Function to fetch camera data from the endpoint
    url = 'http://localhost:3002/cameras'  # Update with your cameras endpoint
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch cameras: {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching cameras: {e}")
    return []


def manage_camera_processors(current_processors, new_camera_data):
    # Function to manage camera processors based on available cameras
    new_processors = {}

    # Stop and remove processors for cameras that are no longer available
    for camera_id, processor in current_processors.items():
        if camera_id not in [camera['_id'] for camera in new_camera_data]:
            processor.stop()
        else:
            new_processors[camera_id] = processor

    # Add processors for new cameras
    for camera in new_camera_data:
        if camera['_id'] not in current_processors:
            new_processor = CameraProcessor(camera)
            new_processors[camera['_id']] = new_processor
            threading.Thread(target=new_processor.process_stream).start()

    return new_processors


def start_camera_streams():
    # Function to start camera streams
    cameras_data = CameraProcessor.fetch_cameras()
    print(cameras_data)  # Add this line to inspect the fetched camera data

    camera_processors = [CameraProcessor(camera_data) for camera_data in cameras_data]

    threads = [threading.Thread(target=processor.process_stream) for processor in camera_processors]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()


def main():
    camera_processors = {}
    refresh_interval = 60  # seconds

    while True:
        try:
            camera_data = fetch_cameras()
            camera_processors = manage_camera_processors(camera_processors, camera_data)
            time.sleep(refresh_interval)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error in main loop: {e}")
            time.sleep(10)  # Wait for a bit before retrying

    # Clean up
    for processor in camera_processors.values():
        processor.stop()


if __name__ == "__main__":
    main()
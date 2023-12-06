# Camera Processing Script

This Python script is designed to handle camera streams, detect motion, and record videos upon detecting motion. It also includes functionality to upload the recorded videos to a specified endpoint.

## Prerequisites

Before using this script, ensure you have the following:

- Python 3.10 installed
- Required libraries: `cv2`, `numpy`, `requests`

## Getting Started

1. Install the required libraries using pip:

   ```bash
   pip install opencv-python numpy requests
   ```

2. Update the script with your specific configurations:
   - Adjust the endpoint URLs for camera data and video uploads (`url` variables).
   - Modify the path for storing recorded videos (`recordings_dir` variable).

## Usage

Run the script using Python:

```bash
python camera_processor.py
```

The script continuously fetches camera data, processes camera streams, detects motion, and records videos. It uploads recorded videos to the specified endpoint.

## Features

- **Motion Detection**: Utilizes OpenCV for motion detection in camera streams.
- **Recording**: Records videos upon detecting motion and saves them locally.
- **Video Upload**: Uploads recorded videos to a specified endpoint.
- **Camera Management**: Dynamically manages camera streams based on available cameras.

## Notes

- Modify and extend the script as needed based on specific use cases and requirements.
- Ensure the script is running on a system with access to the specified camera streams and upload endpoint.
- For any errors or issues, refer to the error logs displayed in the console.
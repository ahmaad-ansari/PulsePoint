const { Client } = require('node-ssdp');
const Camera = require('./models/camera'); // Import your camera model

class CameraDiscovery {
    constructor() {
        this.client = new Client();
        this.client.on('response', this.handleDiscoveryResponse.bind(this));
    }

    startDiscovery() {
        this.client.search('urn:schemas-upnp-org:device:Camera:1');
        setInterval(() => {
            this.client.search('urn:schemas-upnp-org:device:Camera:1');
        }, 30000); // Run discovery every 30 seconds
    }

    async handleDiscoveryResponse(headers, statusCode, rinfo) {
        console.log('Discovered Camera:', headers.LOCATION);

        // Implement logic to extract camera details from the response
        // For example, parse the headers.LOCATION URL for camera info

        // Check if the camera is already in the database
        const existingCamera = await Camera.findOne({ ipAddress: rinfo.address });
        if (!existingCamera) {
            const newCamera = new Camera({
                name: 'New Camera',
                ipAddress: rinfo.address,
                location: 'Unknown',
                streamUrl: 'http://example.com/stream' // Placeholder URL
            });

            await newCamera.save();
            console.log('New camera added:', newCamera);
        }
    }
}

module.exports = CameraDiscovery;

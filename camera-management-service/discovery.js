// Import necessary modules
const { Client } = require('node-ssdp'); // Import Client from node-ssdp library for SSDP functionality
const Camera = require('./models/camera'); // Import the camera model

// Class definition for CameraDiscovery
class CameraDiscovery {
    constructor() {
        // Create a new SSDP client instance
        this.client = new Client();

        // Bind the handleDiscoveryResponse method to 'this' context
        this.client.on('response', this.handleDiscoveryResponse.bind(this));
    }

    // Method to start the camera discovery process
    startDiscovery() {
        // Initial camera discovery search
        this.client.search('urn:schemas-upnp-org:device:Camera:1');

        // Periodically perform camera discovery every 30 seconds
        setInterval(() => {
            this.client.search('urn:schemas-upnp-org:device:Camera:1');
        }, 30000); // Run discovery every 30 seconds
    }

    // Method to handle SSDP discovery responses
    async handleDiscoveryResponse(headers, statusCode, rinfo) {
        console.log('Discovered Camera:', headers.LOCATION);

        // Logic to extract camera details from the SSDP response
        // Extract information from headers.LOCATION URL (specific to your implementation)

        // Check if the discovered camera already exists in the database
        const existingCamera = await Camera.findOne({ ipAddress: rinfo.address });

        // If the camera doesn't exist, add it to the database
        if (!existingCamera) {
            // Create a new Camera object with placeholder information
            const newCamera = new Camera({
                name: 'New Camera',
                ipAddress: rinfo.address,
                location: 'Unknown',
                streamUrl: 'http://example.com/stream' // Placeholder URL
            });

            // Save the new camera details to the database
            await newCamera.save();
            console.log('New camera added:', newCamera);
        }
    }
}

// Export the CameraDiscovery class to be used in other modules
module.exports = CameraDiscovery;
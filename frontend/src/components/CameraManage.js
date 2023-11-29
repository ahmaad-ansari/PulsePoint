import React, { useState, useEffect } from 'react';
import { Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input, useToast } from '@chakra-ui/react';
import { FaEdit, FaSave, FaTrash, FaEye } from 'react-icons/fa';

const CameraManage = () => {
  const [subscribedCameras, setSubscribedCameras] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  
  const toast = useToast();


  const API_BASE_URL_CAMERA = 'http://localhost:3002';

  useEffect(() => {
    const fetchSubscribedCameras = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userData'));
        const userId = user.id;
  
        const response = await fetch(`${API_BASE_URL_CAMERA}/cameras/assigned/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSubscribedCameras(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching subscribed cameras:', error);
      }
    };
  
    fetchSubscribedCameras();
  }, []);

  const handleEdit = (cameraId, name, location) => {
    setEditingId(cameraId);
    setEditedName(name);
    setEditedLocation(location);
  };

  const handleSave = async (cameraId, updatedName, updatedLocation) => {
    try {
      if (!updatedName || !updatedLocation) {
        console.error('Fields cannot be empty');
        return;
      }
  
      const token = localStorage.getItem('token');
  
      const response = await fetch(`${API_BASE_URL_CAMERA}/cameras/${cameraId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedName,
          location: updatedLocation,
          // Include other updated fields as needed
        }),
      });
  
      if (response.ok) {
        // Assuming the response returns the updated camera details
        const updatedCamera = await response.json();
  
        // Update the local state with the updated camera details
        setSubscribedCameras((prevCameras) =>
          prevCameras.map((camera) =>
            camera._id === cameraId ? { ...camera, ...updatedCamera } : camera
          )
        );
  
        setEditingId(null); // Reset editing ID after saving changes
        console.log(`Camera with ID ${cameraId} updated`);
      } else {
        throw new Error('Failed to update camera');
      }
    } catch (error) {
      console.error('Error updating camera:', error);
    }
  };

  const handleRemove = async (cameraId) => {
    try {
      const user = JSON.parse(localStorage.getItem('userData'));
      const userId = user.id;
      // Assuming you have the userId you want to remove from the camera
      const response = await fetch(`${API_BASE_URL_CAMERA}/cameras/${cameraId}/removeUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally add more headers or body if needed
      });
  
      if (response.ok) {
        const data = await response.json();

        toast({
          title: 'Success',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const updatedCameras = subscribedCameras.filter(camera => camera._id !== cameraId);
        setSubscribedCameras(updatedCameras);
        console.log(`User ${userId} removed from camera ${cameraId} successfully`);
      } else {
        // Handle errors if the request fails
        const errorData = await response.json();
        console.error('Error removing user from camera:', errorData.message);
        // Implement additional error handling or display error messages
      }
    } catch (error) {
      console.error('Error removing user from camera:', error.message);
      // Handle fetch errors or exceptions
    }
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Subscribed Cameras
      </Text>
      {subscribedCameras.length === 0 ? (
        <Text textAlign="center">You are not subscribed to any cameras</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>IP Address</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscribedCameras.map((camera) => (
              <Tr key={camera.id}>
                <Td>{camera._id}</Td>
                <Td>
                  {editingId === camera._id ? (
                    <Input
                      defaultValue={camera.name}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    camera.name
                  )}
                </Td>
                <Td>
                  {editingId === camera._id ? (
                    <Input
                      defaultValue={camera.location}
                      onChange={(e) => setEditedLocation(e.target.value)}
                    />
                  ) : (
                    camera.location
                  )}
                </Td>
                <Td>{camera.ipAddress}</Td>
                <Td>
                  {editingId === camera._id ? (
                    <Button
                      colorScheme="green"
                      size="sm"
                      leftIcon={<FaSave />}
                      onClick={() =>
                        handleSave(
                          camera._id,
                          editedName,
                          editedLocation
                        )
                      }
                      mr={2}
                    >
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<FaEdit />}
                        onClick={() =>
                          handleEdit(
                            camera._id,
                            camera.name,
                            camera.location
                          )
                        }
                        mr={2}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        leftIcon={<FaTrash />}
                        onClick={() =>
                          handleRemove(
                            camera._id
                          )
                        }
                        mr={2}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default CameraManage;

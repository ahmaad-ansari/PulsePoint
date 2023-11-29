import React, { useState, useEffect } from 'react';
import { Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input, useToast } from '@chakra-ui/react';
import { FaEdit, FaSave, FaPlus } from 'react-icons/fa';

const CameraView = () => {
  const [cameras, setCameras] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const toast = useToast();

  const API_BASE_URL_CAMERA = 'http://localhost:3002';

  useEffect(() => {
    const fetchNotAssignedCameras = async () => {
      try {
        // Assuming you have the user's ID
        const user = JSON.parse(localStorage.getItem('userData'));
        const userId = user.id;
  
        const response = await fetch(`${API_BASE_URL_CAMERA}/cameras/not-assigned/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCameras(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching cameras not assigned to user:', error);
      }
    };
  
    fetchNotAssignedCameras();
  }, []);
  

  const handleEditCamera = (cameraId, name, location) => {
    setEditingId(cameraId);
    setEditedName(name);
    setEditedLocation(location);
  };

  const handleAddToPersonalList = async (cameraId) => {
    try {
      // Assuming you have the user's ID
      const user = JSON.parse(localStorage.getItem('userData'));
      const userId = user.id;
      const response = await fetch(`${API_BASE_URL_CAMERA}/cameras/${cameraId}/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
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
        const updatedResponse = await fetch(`${API_BASE_URL_CAMERA}/cameras/not-assigned/${userId}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setCameras(updatedData);
        } else {
          throw new Error('Failed to fetch updated data');
        }
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        // Implement additional logic if needed
      }
    } catch (error) {
      console.error('Error adding user to camera:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user to camera',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Implement additional logic if needed
    }
  };
  
  const handleSaveCamera = async (cameraId, updatedName, updatedLocation) => {
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
        // Update the local cameras array with the modified data
        setCameras(prevCameras =>
          prevCameras.map(camera =>
            camera._id === cameraId ? { ...camera, name: updatedName, location: updatedLocation } : camera
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
  

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Camera List
      </Text>
      {cameras.length === 0 ? (
        <Text textAlign="center">There are no cameras for you to add</Text>
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
            {cameras.map((camera) => (
              <Tr key={camera._id}>
                <Td>{camera._id}</Td>
                <Td>
                  {editingId === camera._id ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    camera.name
                  )}
                </Td>
                <Td>
                  {editingId === camera._id ? (
                    <Input
                      value={editedLocation}
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
                        handleSaveCamera(
                          camera._id,
                          editedName,
                          editedLocation
                        )
                      }
                      mr={2} // Add margin to the right
                    >
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button
                        colorScheme="gray"
                        size="sm"
                        leftIcon={<FaEdit />}
                        onClick={() =>
                          handleEditCamera(
                            camera._id,
                            camera.name,
                            camera.location
                          )
                        }
                        mr={2} // Add margin to the right
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<FaPlus />}
                        onClick={() => handleAddToPersonalList(camera._id)}
                      >
                        Add to List
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

export default CameraView;

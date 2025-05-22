import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };
};

export const fetchRoomTypes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/RoomTypes`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching room types:', error);
        throw error;
    }
};

export const createRoomType = async (roomType) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/RoomTypes`, roomType, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating room type:', error);
        throw error;
    }
};

export const updateRoomType = async (id, roomType) => {
    try {
        await axios.put(`${API_BASE_URL}/RoomTypes/${id}`, roomType, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error updating room type ${id}:`, error);
        throw error;
    }
};

export const deleteRoomType = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/RoomTypes/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error deleting room type ${id}:`, error);
        throw error;
    }
}; 
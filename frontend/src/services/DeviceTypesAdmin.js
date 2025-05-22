import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };
};

export const fetchDeviceTypesAdmin = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/DeviceTypes`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching device types:', error);
        throw error;
    }
};

export const createDeviceType = async (deviceType) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/DeviceTypes`, deviceType, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating device type:', error);
        throw error;
    }
};

export const updateDeviceType = async (id, deviceType) => {
    try {
        await axios.put(`${API_BASE_URL}/DeviceTypes/${id}`, deviceType, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error updating device type ${id}:`, error);
        throw error;
    }
};

export const deleteDeviceType = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/DeviceTypes/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error deleting device type ${id}:`, error);
        throw error;
    }
}; 
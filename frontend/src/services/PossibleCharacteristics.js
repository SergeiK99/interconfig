import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };
};

export const fetchPossibleCharacteristics = async (deviceTypeId = null) => {
    try {
        const url = deviceTypeId ? `${API_BASE_URL}/PossibleCharacteristics?deviceTypeId=${deviceTypeId}` : `${API_BASE_URL}/PossibleCharacteristics`;
        const response = await axios.get(url, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error fetching possible characteristics:', error);
        throw error;
    }
};

export const createPossibleCharacteristic = async (possibleCharacteristic) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/PossibleCharacteristics`, possibleCharacteristic, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error creating possible characteristic:', error);
        throw error;
    }
};

export const updatePossibleCharacteristic = async (id, possibleCharacteristic) => {
    try {
        await axios.put(`${API_BASE_URL}/PossibleCharacteristics/${id}`, possibleCharacteristic, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error updating possible characteristic ${id}:`, error);
        throw error;
    }
};

export const deletePossibleCharacteristic = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/PossibleCharacteristics/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
        console.error(`Error deleting possible characteristic ${id}:`, error);
        throw error;
    }
}; 
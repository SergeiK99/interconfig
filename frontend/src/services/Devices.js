import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Функция для получения заголовков с токеном авторизации
const getAuthHeaders = (isFormData = false) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = {
        'Authorization': `Bearer ${user.token}`
    };
    
    // Не устанавливаем Content-Type для FormData, браузер сам установит правильный заголовок
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
};

export const fetchDevices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Devices`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching devices:', error);
        throw error;
    }
};

export const createDevice = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Devices`, formData, {
            headers: getAuthHeaders(true)
        });
        return response.data;
    } catch (error) {
        console.error('Error creating device:', error);
        throw error;
    }
};

export const updateDevice = async (id, formData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Devices/${id}`, formData, {
            headers: getAuthHeaders(true)
        });
        return response.data;
    } catch (error) {
        console.error('Error updating device:', error);
        throw error;
    }
};

export const deleteDevice = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/Devices/${id}`, {
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        throw error;
    }
};

export const fetchBestDevice = async (deviceTypeId, roomTypeId, roomSize, peopleCount, characteristics) => {
    try {
        const body = {
            deviceTypeId,
            roomTypeId,
            roomSize,
            peopleCount,
            characteristics: characteristics || []
        };
        const response = await axios.post(`${API_BASE_URL}/Devices/suitable`, body, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching best device:', error);
        throw error;
    }
};

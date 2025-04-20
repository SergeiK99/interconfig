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

export const fetchDevises = async () => {
    try{
        var response = await axios.get(`${API_BASE_URL}/Devices`);
        return response.data;
    } catch(e) {
        console.error(e);
    }
}

export const createDevice = async (device) => {
    try{
        // Проверяем, является ли device экземпляром FormData
        const isFormData = device instanceof FormData;
        
        var response = await axios.post(`${API_BASE_URL}/Devices`, device, {
            headers: getAuthHeaders(isFormData)
        });
        return response.data;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

export const updateDevice = async (id, device) => {
    try {
        // Проверяем, является ли device экземпляром FormData
        const isFormData = device instanceof FormData;
        
        const response = await axios.put(`${API_BASE_URL}/Devices/${id}`, device, {
            headers: getAuthHeaders(isFormData)
        });
        return response.data;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

export const deleteDevice = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/Devices/${id}`, {
            headers: getAuthHeaders()
        });
        return true;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

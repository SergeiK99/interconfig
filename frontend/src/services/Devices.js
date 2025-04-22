import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        var response = await axios.post(`${API_BASE_URL}/Devices`, device);
        return response.data;
    } catch(e) {
        console.error(e);
    }
}

export const updateDevice = async (id, device) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Devices/${id}`, device);
        return response.data;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

export const deleteDevice = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/Devices/${id}`);
        return true;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

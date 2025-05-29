import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchDeviceTypes = async () => {
    try {
        var response = await axios.get(`${API_BASE_URL}/DeviceTypes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching device types:', error);
        throw error;
    }
};

export const fetchPossibleCharacteristicsByDeviceTypeId = async (deviceTypeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/PossibleCharacteristics?deviceTypeId=${deviceTypeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching possible characteristics for device type ${deviceTypeId}:`, error);
        throw error;
    }
};
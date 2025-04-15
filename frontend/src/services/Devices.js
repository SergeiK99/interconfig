import axios from "axios"

export const fetchDevises = async () => {
    try{
        var response = await axios.get("http://localhost:5115/api/Devices");
        return response.data;
    } catch(e) {
        console.error(e);
    }
}

export const createDevice = async (device) => {
    try{
        var response = await axios.post("http://localhost:5115/api/Devices", device);
        return response.data;
    } catch(e) {
        console.error(e);
    }
}

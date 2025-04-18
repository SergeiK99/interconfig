import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchVentilationTypes = async () => {
    try{
        var response = await axios.get(`${API_BASE_URL}/VentilationTypes`);
        return response.data;
    } catch(e) {
        console.error(e);
    }
}
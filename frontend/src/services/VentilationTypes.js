import axios from "axios"

export const fetchVentilationTypes = async () => {
    try{
        var response = await axios.get("http://localhost:5115/api/VentilationTypes");
        return response.data;
    } catch(e) {
        console.error(e);
    }
}
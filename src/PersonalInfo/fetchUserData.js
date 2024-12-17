import axios from "axios";

const backendURL = "https://price-comparison-backend.onrender.com";

const fetchUserData = async (id) => {
    try {
        const response = await axios.get(`${backendURL}/users/${id}`);

        // console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error.response);
    }
};

export default fetchUserData;
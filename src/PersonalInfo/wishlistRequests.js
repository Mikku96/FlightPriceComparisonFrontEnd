import axios from "axios";

const backendURL = "https://price-comparison-backend.onrender.com";

const addToWishlist = async (userId, flight) => {
    try {
        const response = await axios.post(`${backendURL}/flights`,
            {
                userId: userId,
                flight: flight
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        // console.log(response.data);
        return response.status;
    }
    catch (error) {
        console.log(error.response);
        return error.response.status;
    }
};

const deleteFromWishlist = async (userId, flightId) => {
    console.log(`Deleting ${flightId} from user ${userId}`);

    try {
        const response = await axios.delete(`${backendURL}/flights`,
            {
                data: {
                    userId: userId,
                    flightId: flightId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        // console.log(response.data);
        return response.status;
    }
    catch (error) {
        console.log(error.response);
        return error.response.status;
    }
}

export { addToWishlist, deleteFromWishlist };
import axios from "axios";

const backendURL = "https://price-comparison-backend.onrender.com";

const editPersonalInfo = async (id, username, password, homeLocation, email,
    setErrorMessage) => {
    try {
        const response = await axios.put(`${backendURL}/users/${id}`,
            {
                username: username,
                password: password,
                homeLocation: homeLocation,
                email: email
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        // console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log(error.response);
        setErrorMessage(error.response.data);
    }
};

export { editPersonalInfo };
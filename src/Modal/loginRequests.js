import axios from "axios";

const backendURL = "https://price-comparison-backend.onrender.com";

const attemptLogin = async (username, password, setErrorMessage) => {
    try {
        const response = await axios.post(`${backendURL}/login`,
            {
                username: username,
                password: password
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
        setErrorMessage(error.response.data ? error.response.data : "Render error");
    }
};

const attemptRegister = async (username, password, setErrorMessage) => {
    try {
        const response = await axios.post(`${backendURL}/login/register`,
            {
                username: username,
                password: password
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
        setErrorMessage(error.response.data ? error.response.data : "Render error");
    }
};

export { attemptLogin, attemptRegister };
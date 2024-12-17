import Modal from "react-modal";
import { useState } from "react";
import Button from "../Button.jsx";
import InputBox from "./InputBox.jsx";
import { attemptLogin, attemptRegister } from "./loginRequests.js";

export default function LoginModal({ showLogin, setShowLogin, setCurrentUser, }) {
    const [nameInput, setNameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            const userData = await attemptLogin(
                nameInput,
                passwordInput,
                setErrorMessage
            );
            console.log(`Successfully logged in as ${userData.username}`);
            localStorage.setItem("username", userData.username);
            localStorage.setItem("userId", userData.userId);
            localStorage.setItem("homeLocation", userData.homeLocation);
            setCurrentUser(userData);

            setNameInput("");
            setPasswordInput("");
            setErrorMessage("");
            setShowLogin(false);
        }
        catch {
            console.log("Login failed");
        }
    };

    const handleRegister = async () => {
        try {
            const userData = await attemptRegister(
                nameInput,
                passwordInput,
                setErrorMessage
            );
            console.log("New user successfully registered and logged in.");

            localStorage.setItem("username", userData.username);
            localStorage.setItem("userId", userData.userId);
            setCurrentUser(userData);

            setNameInput("");
            setPasswordInput("");
            setErrorMessage("");
            setShowLogin(false);
        }
        catch {
            console.log("Login failed");
        }
    };

    Modal.setAppElement("#root");

    return (
        <Modal isOpen={showLogin} id="LoginModal" className="p-4 w-2/6 bg-[rgb(98,103,143)] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]  from-[rgba(195,112,24,100)] to-[rgba(195,112,24,100)]] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <Button
                buttonName={"Close"}
                runFunction={() => setShowLogin(false)}
                type={"button"}
                tailWindClass="text-white"
            />
            <div className="flex flex-col items-center">
                <InputBox
                    typeOf={"text"}
                    value={nameInput}
                    onChange={setNameInput}
                    boxName={"Username"}
                />
                <InputBox
                    typeOf={"password"}
                    value={passwordInput}
                    onChange={setPasswordInput}
                    boxName={"Password"}
                />
                <p className="text-white">{errorMessage}</p>
                <div className="flex flex-row flex-wrap justify-around">
                    <Button
                        buttonName={"Login"}
                        runFunction={handleLogin}
                        type={"button"}
                        tailWindClass="text-white m-5"
                    />
                    <Button
                        buttonName={"Register"}
                        runFunction={handleRegister}
                        type={"button"}
                        tailWindClass="text-white m-5"
                    />
                </div>
            </div>
        </Modal>
    );
}

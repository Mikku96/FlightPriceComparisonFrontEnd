import Modal from "react-modal";
import { useState } from "react";
import Button from "../Button.jsx";
import InputBox from "./InputBox.jsx";
import { editPersonalInfo } from "./editUserInfo.js";

export default function PersonalModal({ id, showModal, setShowModal, userData, setUserData }) {
    const [nameInput, setNameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordInput2, setPasswordInput2] = useState("");
    const [homeInput, setHomeInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        try {
            if (passwordInput !== passwordInput2) {
                setErrorMessage("Passwords do not match!");
                setPasswordInput("");
                setPasswordInput2("");
            }
            else {
                const userDataResponse = await editPersonalInfo(
                    id,
                    nameInput,
                    passwordInput,
                    homeInput,
                    emailInput,
                    setErrorMessage
                );
                if (typeof userDataResponse === 'object') {
                    console.log("Successfully updated personal info");
                    setUserData(userDataResponse);

                    const savedUsername = localStorage.getItem('username');
                    const savedHomeLocation = localStorage.getItem('homeLocation');
                    if (userDataResponse.username !== savedUsername) {
                        localStorage.setItem('username', userDataResponse.username);
                        console.log(`Changed username from ${savedUsername} to ${userDataResponse.username}`);
                    }
                    if (userDataResponse.homeLocation !== savedHomeLocation) {
                        localStorage.setItem('homeLocation', userDataResponse.homeLocation);
                        console.log(`Changed homeLocation from ${savedHomeLocation} to ${userDataResponse.homeLocation}`);
                    }

                    handleClose();
                }
                else
                    console.error("Edit request failed");
            }
        }
        catch {
            console.error("Edit request failed");
        }
    };

    const handleClose = () => {
        setNameInput("");
        setPasswordInput("");
        setPasswordInput2("");
        setHomeInput("");
        setEmailInput("");
        setErrorMessage("");
        setShowModal(false);
    }

    const handleHomeInput = (input) => {
        setHomeInput(input.toUpperCase());
    }

    Modal.setAppElement("#root");

    return (
        <Modal isOpen={showModal} id="PersonalModal"
            className="p-4 w-2/6 bg-[rgb(98,103,143)] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]  from-[rgba(195,112,24,100)] to-[rgba(195,112,24,100)]] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button
                buttonName={"Close"}
                runFunction={handleClose}
                type={"button"}
                tailWindClass="text-white"
            />
            <div className="flex flex-col items-center p-5">
                <InputBox
                    typeOf={"text"}
                    value={nameInput}
                    onChange={setNameInput}
                    boxName={"Username"}
                    placeholder={userData.username}
                />
                <InputBox
                    typeOf={"password"}
                    value={passwordInput}
                    onChange={setPasswordInput}
                    boxName={"Password"}
                />
                <InputBox
                    typeOf={"password"}
                    value={passwordInput2}
                    onChange={setPasswordInput2}
                    boxName={"Confirm password"}
                />
                <InputBox
                    typeOf={"text"}
                    value={homeInput}
                    onChange={handleHomeInput}
                    boxName={"Home Airport"}
                    placeholder={userData.homeLocation}
                    maxLength={3}
                />
                <InputBox
                    typeOf={"email"}
                    value={emailInput}
                    onChange={setEmailInput}
                    boxName={"Email"}
                    placeholder={userData.email}
                />
                <p className="text-white">{errorMessage}</p>
                <Button
                    buttonName={"Send"}
                    runFunction={handleSubmit}
                    type={"button"}
                    isDisabled={!nameInput && !homeInput && !emailInput
                        && !passwordInput && !passwordInput2}
                    tailWindClass="text-white p-5"
                />
            </div>
        </Modal>
    );
}
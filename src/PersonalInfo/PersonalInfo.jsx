import { useEffect, useState } from "react";

import fetchUserData from "./fetchUserData.js";

import ContactDetails from "./ContactDetails.jsx";
import WishList from "./WishList.jsx";
import PersonalModal from "../Modal/PersonalModal.jsx";

export default function PersonalInfo() {
    const [userData, setUserData] = useState({});
    const [userId, setUserId] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Run on page-route load; fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            const id = localStorage.getItem("userId");
            const userData = await fetchUserData(id);
            setUserData(userData);
            setUserId(id);
            setLoading(false);
        };
        setLoading(true);
        fetchUserInfo();
    }, []);

    return (
        <>
            {loading === false && (
                <div className="text-white min-h-screen flex flex-row justify-center">
                    <ContactDetails userData={userData} setShowModal={setShowModal} />
                    <WishList userData={userData} setUserData={setUserData} />
                    <PersonalModal id={userId} showModal={showModal}
                        setShowModal={setShowModal} userData={userData}
                        setUserData={setUserData} />
                </div>
            )}
        </>
    );
}

import Button from "../Button.jsx";

export default function ContactDetails({ userData, setShowModal }) {
    const editUserInfo = () => {
        setShowModal(true);
    };

    return (
        <div className="flex flex-col gap-y-3 w-3/12 m-5 ">
            <h1>Contact Details</h1>
            <ul>
                <li>{userData.username}</li>
                <li>{userData?.homeLocation}</li>
                <li>{userData?.email}</li>
            </ul>
            <Button buttonName={"Edit"} runFunction={editUserInfo} type={"button"}
                tailWindClass="w-2/6 justify-center" />
        </div>
    );
}

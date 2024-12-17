import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from "./Button.jsx";
import CompareButton from "./Comparison/CompareButton.jsx";
import { formatDurationFromISO } from "./formatters.js";
import { addToWishlist, deleteFromWishlist } from "./PersonalInfo/wishlistRequests.js";

export default function SingleFlight({
    flight,
    flightOneOrTwo,
    changeFlightOneOrTwo,
    wishlistFunction,
    loggedIn,
    userData,
    setUserData,
    wishlisted = [],
    setWishlisted,
}) {
    //console.log("SingleFlight: ", flight)

    if (flight && Object.keys(flight).length > 0) {
        //intermediate landings count: ${flight.itineraries[0].segments.length - 1},
        //class: ${flight.travelerPricings[0].fareDetailsBySegment.map(item=>item.cabin)},
        //seats left: ${flight.numberOfBookableSeats}`
        //<p>To: {flight.itineraries[0].segments[flight.itineraries[0].segments.length-1].arrival.iataCode}</p>
        let currency = "€";
        if (flight.price.currency !== "EUR") {
            currency = "$";
        }

        const navigate = useNavigate();
        const handleNavigate = () => {
            navigate(`/flightDetails/${flight.uuid}`, { state: { flight } });
        };

        function handleShare() {
            console.log(`NOT IMPLEMENTED!`);
            console.log(
                "Example: localhost:5173/singleFlight/HEL/OSL/2024-11-27/09:00/flightID"
            );
        }

        // FOR NOW! This is for the case, where in Wishlist WE DO NOT have depInfo or arrivalInfo in Data!
        if (!flight.departureInfo) {
            flight.departureInfo = {
                country: flight.itineraries[0].segments[0].departure.iataCode,
                city: "",
            };
            flight.arrivalInfo = {
                country:
                    flight.itineraries[0].segments[
                        flight.itineraries[0].segments.length - 1
                    ].arrival.iataCode,
                city: "",
            };
        }

        // Used only in Flightlist view
        const handleAddToWishlist = async () => {
            const userId = localStorage.getItem("userId");
            const status = await addToWishlist(userId, flight);

            if (status === 200) {
                console.log("Successfully added flight to wishlist");
                setWishlisted((prev) => prev.concat(flight.uuid));
            }
            else if (status === 400)
                showToast();
            else
                console.log("Add to wishlist failed with status " + status);
        }


        // Used only in Wishlist view
        const handleRemoveFromWishlist = async () => {
            const userId = localStorage.getItem("userId");
            const status = await deleteFromWishlist(userId, flight.uuid);

            if (status === 200) {
                console.log("Successfully deleted flight from wishlist");
                const updatedWishlist = userData.wishlist.filter(
                    (f) => f.flightData.uuid !== flight.uuid
                );
                setUserData({ ...userData, wishlist: updatedWishlist });
            }
            else
                console.log("Remove from wishlist failed with status " + status);
        }

        const showToast = () => {
            toast.error("Already wishlisted!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }

        const addToWishlistButton = (
            <Button
                tailWindClass="opacity-75"
                buttonName={
                    !wishlisted.includes(flight.uuid) ? "Add to wishlist" : "Wishlisted!"
                }
                runFunction={handleAddToWishlist}
                type={"button"}
                isDisabled={wishlisted.includes(flight.uuid)}
            />
        );

        const removeFromWishlistButton = (
            <Button
                tailWindClass="opacity-75"
                buttonName={"Remove"}
                runFunction={handleRemoveFromWishlist}
                type={"button"}
            />
        );

        const buttonToShow =
            wishlistFunction === "add"
                ? addToWishlistButton
                : removeFromWishlistButton;

        return (
            <li className="bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))]  from-[rgba(127,192,206,100)]/40 to-[rgba(98,103,143,1)]" key={flight.uuid}>
                <div
                    className="flex flex-row flex-wrap gap-x-3 hover:cursor-pointer
                border-transparent border-2 hover:border-solid hover:border-black 
                hover:border-2"
                    onClick={handleNavigate}
                >
                    {flight.departureInfo && flight.arrivalInfo && (
                        <div className="flex flex-wrap flex-col">
                            <p>
                                From:{" "}
                                {flight.departureInfo.country +
                                    ": " +
                                    flight.departureInfo.city}
                            </p>
                            <p>
                                To:{" "}
                                {flight.arrivalInfo.country + ": " + flight.arrivalInfo.city}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <p>
                            {flight.itineraries[0].segments[0].departure.at.split("T")[0]}
                        </p>
                        <p>
                            {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p>
                            Total time:{" "}
                            {flight.itineraries?.[0]?.duration
                                ? formatDurationFromISO(flight.itineraries[0].duration)
                                : "no data"}
                        </p>
                        {flight.itineraries[0].segments.length > 1 ? (
                            <p>Segmented flight</p>
                        ) : (
                            <p>Direct flight</p>
                        )}
                    </div>
                    <div className="text-2xl">
                        {flight.price.total}
                        {currency}
                    </div>
                </div>
                <div className="h-full w-full flex flex-row flex-wrap justify-end items-center" >
                    <CompareButton
                        tailWindClass="opacity-75"
                        flight={flight}
                        flightOneOrTwo={flightOneOrTwo}
                        changeFlightOneOrTwo={changeFlightOneOrTwo}
                    />
                    <Button
                        tailWindClass="opacity-25"
                        buttonName={"Share"}
                        runFunction={handleShare}
                        type={"button"}
                        isDisabled={true}
                    />
                    {loggedIn && buttonToShow}
                </div>
                <div className="bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))]  from-[rgba(127,192,206,100)]/80 to-[rgba(98,103,143,1)] w-full h-3 opacity-50"></div>
                <ToastContainer />
            </li>
        );
    } else return <li>Empty flight info</li>;
}

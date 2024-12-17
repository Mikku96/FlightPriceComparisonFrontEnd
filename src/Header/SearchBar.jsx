import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Button from "../Button.jsx";
import AdvancedSearch from "./AdvancedSearch.jsx";

import AutoCompleteField from "./AutoCompleteField.jsx";

// Determine minimum for date
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;
//

export default function SearchBar({
    departureDate,
    departureLocation,
    departureTime,
    destinationLocation,
    searchNonStopFlight,
    priceLimit,
    adults,
    travelClass,
    currentUser
}) {
    const [searchObject, setSearchObject] = useState({
        departureLocation: "",
        destinationLocation: "",
        departureDate: "",
        departureTime: "00:00",
        searchNonStopFlight: "false",
        priceLimit: -1, // Max. price set in search
        adults: 1,
        travelClass: "ECONOMY",
    });

    let navigate = useNavigate();

    const [showAdvancedSearch, setAdvancedSearch] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        if (departureLocation && destinationLocation && departureDate)
            setSearchObject({
                departureLocation: departureLocation,
                destinationLocation: destinationLocation,
                departureDate: departureDate,
                departureTime: departureTime,
                searchNonStopFlight: searchNonStopFlight,
                priceLimit: priceLimit,
                adults: adults,
                travelClass: travelClass,
            });
    }, [
        departureLocation,
        destinationLocation,
        departureDate,
        departureTime,
        searchNonStopFlight,
        priceLimit,
        adults,
        travelClass,
    ]);

    useEffect(() => {
        if (searchObject.departureLocation.length === 3 &&
            searchObject.destinationLocation.length === 3 &&
            searchObject.departureDate.length === 10
        ) {
            setSubmitDisabled(false);
        } else { setSubmitDisabled(true) };
    }, [
        searchObject.departureLocation,
        searchObject.destinationLocation,
        searchObject.departureDate
    ]);

    function updateSearchObject(event) {
        const target = event.target.name;
        const value = event.target.value;
        if (target === "searchNonStopFlight") {
            if (searchObject.searchNonStopFlight === "false") {
                const newObject = { ...searchObject, [target]: "true" };
                setSearchObject(newObject);
            } else {
                const newObject = { ...searchObject, [target]: "false" };
                setSearchObject(newObject);
            }
        } else {
            const newObject = { ...searchObject, [target]: value };
            setSearchObject(newObject);
        }
        if (target === "departureTime" && value === "") {
            setSearchObject({ ...searchObject, departureTime: "00:00" });
        }
    }

    function onChooseIATA(airportObject, name) {
        if (airportObject) {
            if (airportObject.code !== undefined) {
                const newObject = { ...searchObject, [name]: airportObject.code.toUpperCase() };
                setSearchObject(newObject);
            } else {
                const newObject = { ...searchObject, [name]: airportObject.toUpperCase() };
                setSearchObject(newObject);
            }
        }
    }

    // Advanced Search is like a switch!
    function switchAdvancedSearch(event) {
        event.preventDefault();

        // IF we switch it off, then nullify all the advanced options
        // back to defaults

        // Could also be, that "Link to" is just changed
        if (!showAdvancedSearch === false) {
            const newObject = {
                ...searchObject,
                isDirect: "false",
                adults: 1,
                travelClass: "ECONOMY",
            };
            setSearchObject(newObject);
        }
        setAdvancedSearch(!showAdvancedSearch);
    }

    function submitForm(event) {
        event.preventDefault();
        navigate(
            `/results/${searchObject.departureLocation}/${searchObject.destinationLocation
            }/${searchObject.departureDate}/${searchObject.departureTime
            }/${false}/${-1}/${-1}/${searchObject.searchNonStopFlight}/${searchObject.priceLimit
            }/${searchObject.adults}/${searchObject.travelClass}`,
            { replace: true });
    }

    return (
        <form className="w-10/12" onSubmit={(event) => submitForm(event)}>
            <div className="mt-5 mb-5 p-3 bg-slate-200 border-2 rounded-xl w-10/12 m-auto border-slate-700 border-solid flex flex-col justify-evenly">
                <div className="flex flex-row flex-wrap justify-evenly flex-wrap">
                    <AutoCompleteField
                        placeHolder="From... (IATA)"
                        name="departureLocation"
                        onChoose={onChooseIATA}
                        defaultValue={currentUser?.homeLocation}
                        value={searchObject.departureLocation}
                    />
                    <AutoCompleteField
                        placeHolder="To... (IATA)"
                        name="destinationLocation"
                        onChoose={onChooseIATA}
                        value={searchObject.destinationLocation}
                    />
                    <input
                        className="bg-transparent focus:outline-none"
                        type="date"
                        value={searchObject.departureDate}
                        name="departureDate"
                        min={currentDate}
                        onChange={(event) => updateSearchObject(event)}
                    />
                    <input
                        className="bg-transparent focus:outline-none"
                        type="time"
                        value={searchObject.departureTime}
                        name="departureTime"
                        onChange={(event) => updateSearchObject(event)}
                    />
                </div>
                <div className="flex flex-row flex-wrap justify-evenly flex-wrap">
                    <Button
                        tailWindClass="text-white"
                        buttonName={"Advanced Search"}
                        runFunction={(event) => switchAdvancedSearch(event)}
                        type={"button"}
                    />

                    <Button
                        tailWindClass="uppercase font-sans
    bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500
    backdrop-blur-lg
    rounded-full
    text-sm text-white font-semibold
    p-4 m-2
    flex items-center justify-center
    h-10 align-middle
    shadow-xl
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-violet-400/60
    active:translate-y-1 active:shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed
    border border-solid border-white/30
    relative overflow-hidden
    font-bold cursor-pointer  
    text-center px-5 py-1
                "
                        buttonName={"Submit"}
                        isDisabled={submitDisabled}
                        type={"submit"}
                    >
                    </Button>
                </div>
                <div className="flex flex-row flex-wrap justify-evenly flex-wrap">
                {showAdvancedSearch && (
                    <div className="mt-5 mb-5 p-3 bg-slate-200 border-2 rounded-xl w-8/12 border-slate-700 border-solid flex flex-row flex-wrap justify-evenly gap-5">
                        <AdvancedSearch
                            searchObject={searchObject}
                            updateSearchObject={updateSearchObject}
                        />
                    </div>
                )}
                </div>
            </div>
        </form>
    );
}

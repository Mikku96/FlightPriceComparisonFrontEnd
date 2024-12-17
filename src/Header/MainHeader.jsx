import {
    Outlet,
    useLoaderData,
    useLocation,
    matchPath,
} from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar.jsx";
import LoginModal from "../Modal/LoginModal.jsx";

import HeaderButtons from "./HeaderButtons.jsx";

export default function MainHeader() {
    const url = useLocation();
    // console.log(url);
    const params = url.pathname.split("/");
    // console.log(params);

    const [showLogin, setShowLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Change to "false" if you want the default option to be to use API
    const [useTestData, setUseTestData] = useState(true);

    const location = useLocation();
    const isMainPage = matchPath("/", location.pathname);
    const isFlightList = matchPath("/results/*", location.pathname);

    const handleCheckboxChange = () => {
        setUseTestData(!useTestData);
    };

    useEffect(() => {
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");
        const homeLocation = localStorage.getItem("homeLocation");
        if (username && userId !== undefined) {
            setCurrentUser({ username, userId, homeLocation });
            //console.log("Set current user as: ", { username, userId, homeLocation });
        }
    }, [showLogin, location]);  // Runs when changing pages so personal info edits take effect

    return (
        <>
            <div className="bg-[rgba(68,75,101,100)] h-4/5 flex justify-between items-center text-white">
                <HeaderButtons
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    showLogin={showLogin}
                    setShowLogin={setShowLogin}
                />
            </div>
            {(isMainPage || isFlightList) && (
                <div className={`flex flex-col items-center ${isMainPage && "min-h-screen"}`}>
                    <SearchBar
                        departureLocation={params[2]}
                        destinationLocation={params[3]}
                        departureDate={params[4]}
                        departureTime={params[5]}
                        searchNonStopFlight={params[9]}
                        priceLimit={params[10]}
                        adults={params[11]}
                        travelClass={params[12]}
                        currentUser={currentUser}
                    />
                    <div>
                        <label>Use test data</label>
                        <input
                            className="accent-slate-700"
                            type="checkbox"
                            name="enableTestData"
                            value={useTestData}
                            checked={useTestData}
                            onChange={handleCheckboxChange}
                        ></input>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-center">
                <LoginModal
                    showLogin={showLogin}
                    setShowLogin={setShowLogin}
                    setCurrentUser={setCurrentUser}
                />
            </div>

            <Outlet context={useTestData} />
        </>
    );
}

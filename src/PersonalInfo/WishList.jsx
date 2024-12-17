import SingleFlight from "../SingleFlight.jsx";
import { useState } from "react";

export default function WishList({ userData, setUserData }) {
  const [flightOneOrTwo, setFlightOneOrTwo] = useState(
    localStorage.getItem("flightOneOrTwo") === null
      ? 1
      : localStorage.getItem("flightOneOrTwo") === "1"
      ? 1
      : 2
  );

  const changeFlightOneOrTwo = (value) => {
    setFlightOneOrTwo(value);
    localStorage.setItem("flightOneOrTwo", value.toString());
  };

  return (
    <div className="flex flex-col gap-y-3 w-7/12 m-5 ">
      <h1>My Wishlist</h1>
      <ul>
        {userData.wishlist.map((flight) => (
          <SingleFlight
            key={flight?.flightId}
            flight={flight?.flightData}
            flightOneOrTwo={flightOneOrTwo}
            changeFlightOneOrTwo={changeFlightOneOrTwo}
            wishlistFunction={"remove"}
            loggedIn={true}
            userData={userData}
            setUserData={setUserData}
          />
        ))}
      </ul>
    </div>
  );
}

import { useState, useEffect } from "react";
import Button from "../Button.jsx";
import SingleFlight from "../SingleFlight.jsx";
import OrderBy from "./OrderBy.jsx";
import orderFunction from "./orderFunction.js";
import { formatDurationFromISO } from "../formatters.js";

export default function Flightlist({
  departureTime,
  isDirect,
  durationValue,
  priceValue,
  flights,
  loading,
  error,
  howManyShown,
  showMore,
  setHowManyShown,
  loggedIn,
}) {
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [flightOneOrTwo, setFlightOneOrTwo] = useState(
    localStorage.getItem("flightOneOrTwo") === null
      ? 1
      : localStorage.getItem("flightOneOrTwo") === "1"
      ? 1
      : 2
  );
  // For tracking what the user has just wishlisted, doesn't persist
  const [wishlisted, setWishlisted] = useState([]);
  const [orderBy, setOrderBy] = useState("cheapestFirst");

  const changeFlightOneOrTwo = (value) => {
    setFlightOneOrTwo(value);
    localStorage.setItem("flightOneOrTwo", value.toString());
  };

  useEffect(() => {
    setHowManyShown(Math.ceil(5 / (window.outerWidth / window.innerWidth)) + Math.ceil(+1/(Math.ceil((window.outerWidth / window.innerWidth) * 100)/100)));
    // console.log(filteredFlights);

    const newFilteredFlights = flights.filter((flight) => {
      const matchdirect =
        isDirect === "true"
          ? flight.itineraries[0].segments.length === 1
          : true;
      const matchDepTime = 
        flight.itineraries[0].segments[0].departure.at
          .split("T")[1].slice(0, -3) < departureTime
            ? false : true;

      // console.log(Number.parseInt(priceValue));
      const matchprice = priceValue
        ? Number(flight.price.total) <= Number(priceValue)
        : true;
      //console.log(isDirect);

      /*console.log(
                  formatDurationFromISO(flight.itineraries[0].duration).split("h")[0]
                );*/
      
      const matchduration = durationValue
        ? (flight.itineraries?.[0]?.duration
            ? Number(
                formatDurationFromISO(flight.itineraries[0].duration).split(
                  "h"
                )[0]
              )
            : "no data") < Number.parseInt(durationValue)
        : true;   

      return matchdirect && matchDepTime && matchprice && matchduration;
    });
    newFilteredFlights.sort(orderFunction(orderBy));
    setFilteredFlights(newFilteredFlights);
  }, [isDirect, durationValue, priceValue, flights, orderBy]);

  return (
    <>
      {loading && <p className="min-h-screen">Loading...</p>}

      {error && <p className="min-h-screen text-[rgb(255,0,0)]">{error}</p>}

      {!loading && filteredFlights.length > 0 ? (
        <div className="flex flex-col gap-y-8 w-6/12 m-5 min-h-screen">
          <OrderBy orderBy={orderBy} updateOrder={setOrderBy} />
          <ul>
            {filteredFlights
              .filter((_, index) => howManyShown > index)
              .map((flight) => (
                <SingleFlight
                  key={flight.uuid}
                  flight={flight}
                  flightOneOrTwo={flightOneOrTwo}
                  changeFlightOneOrTwo={changeFlightOneOrTwo}
                  wishlistFunction={"add"}
                  loggedIn={loggedIn}
                  wishlisted={wishlisted}
                  setWishlisted={setWishlisted}
                />
              ))}
          </ul>
        </div>
      ) : (
        !loading && (
          <div className="flex flex-col w-6/12">
            <p>No flights found.</p>
          </div>
        )
      )}
    </>
  );
}

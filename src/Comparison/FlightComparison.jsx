import {
  formatDurationFromISO,
  formatDateTime,
  formatDuration,
} from "../formatters.js";
import { getCabinClass } from "../FlightDetails.jsx";
import airlines from '../../public/airlines.js';



export default function flightComparison() {
  const flights = [
    { ...JSON.parse(localStorage.getItem("flight1")), id: 1 },
    { ...JSON.parse(localStorage.getItem("flight2")), id: 2 },
  ];

  const firstSegments = flights.map(
    (flight) => flight.itineraries?.[0]?.segments?.[0]
  );
  const lastSegments = flights.map(
    (flight) =>
      flight.itineraries?.[0]?.segments?.[
        flight.itineraries[0].segments.length - 1
      ]
  );

  const classes = { ECONOMY: 4, PREMIUM_ECONOMY: 3, BUSINESS: 2, FIRST: 1 };

  const red = "bg-red-400";
  const green = "bg-lime-400";

  return (
    <div className="min-h-screen">
        <div className="flex flex-col m-10 bg-gray-100 rounded-lg p-5">
        <table className="table-auto border-separate border-spacing-2">
            <thead className="text-3xl text-center text-gray-800">
            <tr>
                <th></th>
                <th>Flight 1</th>
                <th>Flight 2</th>
            </tr>
            </thead>
            <tbody className="text-center text-gray-800">
            <tr>
                <th>From:</th>
                {flights.map((flight) => (
                <td key={flight.id}>
                    {flight.departureInfo.country +
                    ": " +
                    flight.departureInfo.city}
                </td>
                ))}
            </tr>
            <tr>
                <th>To:</th>
                {flights.map((flight) => (
                <td key={flight.id}>
                    {flight.arrivalInfo.country + ": " + flight.arrivalInfo.city}
                </td>
                ))}
            </tr>
            <tr>
                <th>Departure day and time:</th>
                {firstSegments.map((firstSegment) => (
                <td key={firstSegment.id}>
                    {firstSegment
                    ? `${formatDateTime(firstSegment.departure.at)}`
                    : "no data"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Arrival day and time:</th>
                {lastSegments.map((lastSegment) => (
                <td key={lastSegment.id}>
                    {lastSegment
                    ? `${formatDateTime(lastSegment.arrival.at)}`
                    : "no data"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Airline:</th>
                {flights.map((flight) => (
                <td key={flight.id}>
                    {airlines[flight.itineraries[0]?.segments[0]?.carrierCode] || flight.itineraries[0].segments[0]?.carrierCode || 
                    "unknown"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Price:</th>
                {flights.map((flight) => (
                <td
                    className={
                    Number(flight.price.total) ===
                        flights
                        .map((item) => Number(item.price.total))
                        .reduce((a, b) => Math.max(a, b)) &&
                    flights[0].price.total !== flights[1].price.total
                        ? red
                        : green
                    }
                    key={flight.id}
                >
                    {flight.price?.total
                    ? `${flight.price.total} ${flight.price.currency}`
                    : "no data"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Direct flight:</th>
                {flights.map((flight) => (
                <td
                    className={
                    flight.itineraries[0].segments.length > 1 &&
                    flights[0].itineraries[0].segments.length !==
                        flights[1].itineraries[0].segments.length
                        ? red
                        : green
                    }
                    key={flight.id}
                >
                    {flight.itineraries[0].segments.length <= 1 ? "Yes" : "No"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Seats left:</th>
                {flights.map((flight) => (
                <td
                    className={
                    Number(flight.numberOfBookableSeats) ===
                        flights
                        .map((item) => Number(item.numberOfBookableSeats))
                        .reduce((a, b) => Math.max(a, b)) &&
                    flights[0].numberOfBookableSeats !==
                        flights[1].numberOfBookableSeats
                        ? red
                        : green
                    }
                    key={flight.id}
                >
                    {flight.numberOfBookableSeats}
                </td>
                ))}
            </tr>
            <tr>
                <th>Total duration:</th>
                {flights.map((flight) => (
                <td
                    className={
                    formatDurationFromISO(flight.itineraries[0].duration)
                        .split(" ")
                        .map((part) => parseInt(part))
                        .reduce((a, b) => a * 60 + b) ===
                        flights
                        .map((item) =>
                            formatDurationFromISO(item.itineraries[0].duration)
                            .split(" ")
                            .map((part) => parseInt(part))
                            .reduce((a, b) => a * 60 + b)
                        )
                        .reduce((a, b) => Math.max(a, b)) &&
                    formatDurationFromISO(flights[0].itineraries[0].duration) !==
                        formatDurationFromISO(flights[1].itineraries[0].duration)
                        ? red
                        : green
                    }
                    key={flight.id}
                >
                    {flight.itineraries?.[0]?.duration
                    ? formatDurationFromISO(flight.itineraries[0].duration)
                    : "no data"}
                </td>
                ))}
            </tr>
            <tr>
                <th>Class:</th>
                {flights.map((flight) => (
                <td
                    className={
                    classes[
                        flight.travelerPricings[0].fareDetailsBySegment[0].cabin
                    ] ===
                        flights
                        .map(
                            (item) =>
                            classes[
                                item.travelerPricings[0].fareDetailsBySegment[0]
                                .cabin
                            ]
                        )
                        .reduce((a, b) => Math.max(a, b)) &&
                    flights[0].travelerPricings[0].fareDetailsBySegment[0]
                        .cabin !==
                        flights[1].travelerPricings[0].fareDetailsBySegment[0].cabin
                        ? red
                        : green
                    }
                    key={flight.id}
                >
                    {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin
                    ? getCabinClass(
                        flight.travelerPricings[0].fareDetailsBySegment[0].cabin
                        )
                    : "no data"}
                </td>
                ))}
            </tr>
            </tbody>
        </table>
        </div>       
    </div>
  );
}

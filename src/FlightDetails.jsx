import airlines from '../public/airlines.js';

const apiKey = import.meta.env.VITE_CLIENT_WEATHER;

import { getAccessToken } from './FlightResults/fetchFlights.js';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  formatDurationFromISO,
  formatDateTime,
  formatDuration,
} from "./formatters";

export const getCabinClass = (cabin) => {
  switch (cabin.toUpperCase()) {
    case "ECONOMY":
      return "Economy";
    case "BUSINESS":
      return "Business";
    case "FIRST":
      return "First Class";
    default:
      return "Unknown Class";
  }
};

export default function FlightDetails() {

  const location = useLocation();
  const { flight } = location.state || {};
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [delayData, setDelayData] = useState(null);
  const [delayLoading, setDelayLoading] = useState(true);
  const [delayError, setDelayError] = useState(null);

  const getTemperatureColor = (temperature) => {
    if (temperature <= 0) return "bg-blue-500";
    if (temperature > 0 && temperature <= 15) return "bg-blue-300";
    if (temperature > 15 && temperature <= 25) return "bg-yellow-300";
    return "bg-red-500";
  };

  useEffect(() => {
    if (!flight || !flight.arrivalInfo || !flight.arrivalInfo.city || !flight.itineraries?.[0]?.segments?.length) {
      setWeatherError("incorrect information");
      setWeatherLoading(false);
      return;
    }

    const arrivalCity = flight.arrivalInfo.city;
    const arrivalDate = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at.split("T")[0];
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${arrivalCity}&dt=${arrivalDate}&days=1`; // days is required according to api documentation!

    // Fetch weather data
    const getWeather = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(` fail : ${response.status}`);
        }

        const data = await response.json();
        setWeather({
          tempCelsius: data.forecast.forecastday[0].day.avgtemp_c,
          condition: data.forecast.forecastday[0].day.condition.text,
        });
      } catch (error) {
        console.error("error", error);
        setWeatherError("failed");
      } finally {
        setWeatherLoading(false);
      }
    };

    getWeather();
  }, [flight]);

  useEffect(() => {
    const auxiliaryFunction = async () => {
      if (!flight || !flight.itineraries?.[0]?.segments?.length) {
        setDelayError("no delay data available.");
        setDelayLoading(false);
        return;
      }

      const segment = flight.itineraries[0].segments[0];


      // The URLSearchParams is a built-in JS object that provides methods to work with the query string of a URL

      const params = new URLSearchParams({
        originLocationCode: segment.departure.iataCode,
        destinationLocationCode: segment.arrival.iataCode,
        departureDate: segment.departure.at.split("T")[0],
        departureTime: segment.departure.at.split("T")[1],
        arrivalDate: segment.arrival.at.split("T")[0],
        arrivalTime: segment.arrival.at.split("T")[1],
        aircraftCode: segment.aircraft.code,
        carrierCode: segment.carrierCode,
        flightNumber: segment.number,
        duration: segment.duration,
      });

      // console.log(params);

      const delayUrl = `https://test.api.amadeus.com/v1/travel/predictions/flight-delay?${params}`;

      const token = await getAccessToken();
      const getDelay = async () => {
        try {
          const delayResponse = await fetch(delayUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!delayResponse.ok) {
            throw new Error('Failed to fetch flight delay data.');
          }

          const delayData = await delayResponse.json();
          setDelayData(delayData);
        } catch (error) {
          console.error("error", error);
          setDelayError("Failed to fetch delay information.");
        } finally {
          setDelayLoading(false);
        }
      };

      getDelay();
    }
    auxiliaryFunction();
  }, [flight]);

  if (!flight) {
    return (
      <p className="text-center text-gray-500">No flight data available</p>
    );
  }

  const price = flight.price?.total
    ? `${flight.price.total} ${flight.price.currency}`
    : "no data";
  const seatsLeft = flight.numberOfBookableSeats || "no data";
  const totalDuration = flight.itineraries?.[0]?.duration
    ? formatDurationFromISO(flight.itineraries[0].duration)
    : "no data";
  const carrierCode =
    flight.itineraries?.[0]?.segments?.[0]?.carrierCode || "unknown";


  const airlineName = airlines[carrierCode] || carrierCode;

  const firstSegment = flight.itineraries?.[0]?.segments?.[0];
  const lastSegment =
    flight.itineraries?.[0]?.segments?.[
    flight.itineraries[0].segments.length - 1
    ];
  const departureInfo = firstSegment
    ? `${firstSegment.departure.iataCode} at ${formatDateTime(
      firstSegment.departure.at
    )}`
    : "no data";
  const arrivalInfo = lastSegment
    ? `${lastSegment.arrival.iataCode} at ${formatDateTime(
      lastSegment.arrival.at
    )}`
    : "no data";
  const cabinClass = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
    ?.cabin
    ? getCabinClass(flight.travelerPricings[0].fareDetailsBySegment[0].cabin)
    : "no data";

  return (
    <div className="max-w-4xl mx-auto m-5 p-5 font-sans leading-relaxed bg-gray-100 rounded-lg bg-[rgba(99,102,141,0.05)]">
      <h1 className="text-3xl text-center text-gray-800 mb-6">Flight Details</h1>

      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Price</h2>
            <p className="text-lg text-gray-800">{price}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Airline</h2>
            <p className="text-lg text-gray-800">{airlineName}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Departure</h2>
            <p className="text-lg text-gray-800">{departureInfo}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Arrival</h2>
            <p className="text-lg text-gray-800">{arrivalInfo}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Total duration</h2>
            <p className="text-lg text-gray-800">{totalDuration}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Seats left</h2>
            <p className="text-lg text-gray-800">{seatsLeft}</p>
          </div>
        </div>

        <div className="w-full px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">Class</h2>
            <p className="text-lg text-gray-800">{cabinClass}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className={` p-4 rounded shadow w-full px-2 mb-4 ${weather ? getTemperatureColor(weather.tempCelsius) : "bg-white"}`}>
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)] ">
              Arrival city weather
            </h2>
            {weatherLoading ? (
              <p className="text-lg text-gray-800">Loading weather...</p>
            ) : weatherError ? (
              <p className="text-lg text-red-500">{weatherError}</p>
            ) : (
              <div className="text-lg text-gray-800">
                <p>
                  <strong>temp:</strong> {weather.tempCelsius}°C
                </p>
                <p>
                  <strong>cond:</strong> {weather.condition}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <div className="p-4 rounded shadow bg-white">
            <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">
              Flight delay prediction
            </h2>
            {delayLoading ? (
              <p className="text-lg text-gray-800">Loading delay info...</p>
            ) : delayError ? (
              <p className="text-lg text-red-500">{delayError}</p>
            ) : delayData ? (
              <div className="text-sm text-gray-800">
                {delayData.data.map((item, index) => {

                  const delayLabel = item.result.replace(/_/g, " ");
                  let compactLabel;

                  switch (delayLabel) {
                    case "LESS THAN 30 MINUTES":
                      compactLabel = "<30 MINUTES";
                      break;
                    case "BETWEEN 30 AND 60 MINUTES":
                      compactLabel = "30-60 MINUTES";
                      break;
                    case "BETWEEN 60 AND 120 MINUTES":
                      compactLabel = "60-120 MINUTES";
                      break;
                    case "OVER 120 MINUTES OR CANCELLED":
                      compactLabel = ">120 MINUTES / CANCELLED";
                      break;
                    default:
                      compactLabel = delayLabel;
                  }

                  return (
                    <p key={index}>
                      <strong>{compactLabel}</strong> with odds of{" "}
                      {Math.round(item.probability * 100)}%
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-lg text-gray-800">No delay prediction available</p>
            )}
          </div>
        </div>

      </div>
      <div className="my-5">
        <h2 className="text-xl text-gray-700 border-b pb-1 border-[rgba(99,102,141,0.5)]">
          Flight segments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-[rgba(99,102,141,0.5)]">
                  From
                </th>
                <th className="py-2 px-4 border-b border-[rgba(99,102,141,0.5)]">
                  To
                </th>
                <th className="py-2 px-4 border-b border-[rgba(99,102,141,0.5)]">
                  Carrier
                </th>
                <th className="py-2 px-4 border-b border-[rgba(99,102,141,0.5)]">
                  Duration
                </th>
                <th className="py-2 px-4 border-b border-[rgba(99,102,141,0.5)]">
                  Class
                </th>
              </tr>
            </thead>
            <tbody>
              {flight.itineraries?.[0]?.segments?.map((segment) => (
                <tr key={segment.id}>
                  <td className="py-2 px-4 border-b border-[rgba(99,102,141,0.2)]">
                    {segment.departure.iataCode} at{" "}
                    {formatDateTime(segment.departure.at)}
                  </td>
                  <td className="py-2 px-4 border-b border-[rgba(99,102,141,0.2)]">
                    {segment.arrival.iataCode} at{" "}
                    {formatDateTime(segment.arrival.at)}
                  </td>
                  <td className="py-2 px-4 border-b border-[rgba(99,102,141,0.2)]">
                    {segment.carrierCode} {segment.number}
                  </td>
                  <td className="py-2 px-4 border-b border-[rgba(99,102,141,0.2)]">
                    {formatDuration(segment.duration)}
                  </td>
                  <td className="py-2 px-4 border-b border-[rgba(99,102,141,0.2)]">
                    {getCabinClass(
                      flight.travelerPricings[0].fareDetailsBySegment.find(
                        (fd) => fd.segmentId === segment.id
                      )?.cabin || "no data"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

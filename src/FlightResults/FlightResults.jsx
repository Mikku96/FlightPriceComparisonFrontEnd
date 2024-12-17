import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import Flightlist from "./Flightlist.jsx";
import fetchFlights from "./fetchFlights.js";
import { v4 as uuidv4 } from "uuid";
import SideBar from "./SideBar.jsx";
import { formatDurationFromISO } from "../formatters.js";

export function loader({ params }) {
    return params;
}

export default function FlightResults() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [howManyShown, setStateHowManyShown] = useState(5);
    const [maxPrice, setMaxPrice] = useState(-1);
    const [maxDuration, setMaxDuration] = useState(-1);
    const [priceAnalytics, setPriceAnalytics] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const showMore = () => {
        setStateHowManyShown((prev) => prev + 5);
    };

    const setHowManyShown = (value) => {
        setStateHowManyShown(value);
    };

    const onScroll = () => {
        if (
            window.innerHeight + 2.0 * Math.ceil(window.scrollY) + 1 / (Math.ceil((window.outerWidth / window.innerWidth) * 100) / 100) >=
            document.body.scrollHeight
        ) {
            showMore();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
    }, []);

    const params = useLoaderData();
    const useTestData = useOutletContext();

    async function obtainLocations() {
        const fromIATA = params.departureLocation;
        const toIATA = params.destinationLocation;

        const airportJSON = await fetch(
            "/airports.json",
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        const airportData = await airportJSON.json();
        let departureInfo = airportData.find(
            (location) => location.code === fromIATA
        );
        let arrivalInfo = airportData.find((location) => location.code === toIATA);

        if (departureInfo === undefined) {
            departureInfo = {
                code: fromIATA,
                city: "Unknown",
                airport: null,
                country: "Nowhere",
            };
        }
        if (arrivalInfo === undefined) {
            arrivalInfo = {
                code: toIATA,
                city: "Unknown",
                airport: null,
                country: "Nowhere",
            };
        }
        return [departureInfo, arrivalInfo];
    }

    const navigate = useNavigate();

    useEffect(() => {
        const runFetch = async () => {
            setLoading(true);
            setError(null);

            try {
                const locations = await obtainLocations();

                if (useTestData) {
                    console.log(`Using test data: ${useTestData}`);
                    const flightDataJSON = await fetch(
                        `/HEL_CAI_28_11.json`,
                        {
                            headers: {
                                Accept: "application/json",
                            },
                        }
                    );
                    const data = await flightDataJSON.json();
                    const testResult = {
                        flightData: { data: data },
                        priceAnalyticsData: null,
                    };

                    setFlights(
                        testResult.flightData.data
                            ? testResult.flightData.data.map((flight) => ({
                                ...flight,
                                uuid: uuidv4(),
                                departureInfo: locations[0],
                                arrivalInfo: locations[1],
                            }))
                            : []
                    );
                    setPriceAnalytics(testResult.priceAnalyticsData);
                    setLoading(false);

                    const newMaxPrice = testResult.flightData.data
                        ? testResult.flightData.data
                            .map((flight) => Math.ceil(Number(flight.price.total)))
                            .reduce((a, b) => Math.max(a, b), -1)
                        : maxPrice;

                    const newMaxDuration = testResult.flightData.data
                        ? testResult.flightData.data
                            .map((flight) => {
                                return flight.itineraries?.[0]?.duration
                                    ? Number(
                                        formatDurationFromISO(
                                            flight.itineraries[0].duration
                                        ).split("h")[0]
                                    ) + 1
                                    : 0;
                            })
                            .reduce((a, b) => Math.max(a, b), -1)
                        : maxDuration;
                    setMaxPrice(newMaxPrice);
                    setMaxDuration(newMaxDuration);

                    if (params.priceValue === "-1" || params.durationValue === "-1") {
                        navigate(
                            `/results/${params.departureLocation}/${params.destinationLocation}/${params.departureDate}/${params.departureTime}/${params.isDirect}/${newMaxPrice}/${newMaxDuration}/${params.searchNonStopFlight}/${params.priceLimit}/${params.adults}/${params.travelClass}`,
                            { replace: true }
                        );
                        // console.log("first navigate");
                        // console.log("maxPrice:" + newMaxPrice);
                    }
                } else {
                    const cacheKey = `flightData_${params.departureLocation}_${params.destinationLocation}_${params.departureDate}_${params.departureTime}_${params.isDirect}_${params.searchNonStopFlight}_${params.priceLimit}_${params.adults}_${params.travelClass}`;

                    // check if data exists in cache
                    const cachedData = sessionStorage.getItem(cacheKey);
                    if (cachedData) {
                        const { flightData, priceAnalyticsData } = JSON.parse(cachedData);
                        setFlights(
                            flightData.data
                                ? flightData.data.map((flight) => ({
                                    ...flight,
                                    uuid: uuidv4(),
                                    departureInfo: locations[0],
                                    arrivalInfo: locations[1],
                                }))
                                : []
                        );
                        setPriceAnalytics(priceAnalyticsData);
                        setLoading(false);

                        const newMaxPrice = flightData.data
                            ? flightData.data
                                .map((flight) => Math.ceil(Number(flight.price.total)))
                                .reduce((a, b) => Math.max(a, b), -1)
                            : maxPrice;
                        const newMaxDuration = flightData.data
                            ? flightData.data
                                .map((flight) => {
                                    return flight.itineraries?.[0]?.duration
                                        ? Number(
                                            formatDurationFromISO(
                                                flight.itineraries[0].duration
                                            ).split("h")[0]
                                        ) + 1
                                        : 0;
                                })
                                .reduce((a, b) => Math.max(a, b), -1)
                            : maxDuration;
                        setMaxPrice(newMaxPrice);
                        setMaxDuration(newMaxDuration);

                        if (params.priceValue === "-1" || params.durationValue === "-1") {
                            navigate(
                                `/results/${params.departureLocation}/${params.destinationLocation}/${params.departureDate}/${params.departureTime}/${params.isDirect}/${newMaxPrice}/${newMaxDuration}/${params.searchNonStopFlight}/${params.priceLimit}/${params.adults}/${params.travelClass}`,
                                { replace: true }
                            );
                            // console.log("first navigate");
                            // console.log("maxPrice:" + newMaxPrice);
                        }
                    } else {
                        const result = await fetchFlights(params);

                        if (result === "error.") {
                            setError("error.");
                            setFlights([]);
                            setPriceAnalytics(null);
                        } else {
                            const { flightData, priceAnalyticsData } = result;

                            setFlights(
                                flightData.data
                                    ? flightData.data.map((flight) => ({
                                        ...flight,
                                        uuid: uuidv4(),
                                        departureInfo: locations[0],
                                        arrivalInfo: locations[1],
                                    }))
                                    : []
                            );
                            // console.log("Flight Data:", flightData.data);
                            setHowManyShown(5);
                            setPriceAnalytics(priceAnalyticsData);
                            // console.log("Price Analytics Data:", priceAnalyticsData);

                            setLoading(false);

                            // save fetched data to cache with the unique key
                            sessionStorage.setItem(
                                cacheKey,
                                JSON.stringify({ flightData, priceAnalyticsData })
                            );

                            const newMaxPrice = flightData.data
                                ? flightData.data
                                    .map((flight) => Math.ceil(Number(flight.price.total)))
                                    .reduce((a, b) => Math.max(a, b), -1)
                                : maxPrice;
                            const newMaxDuration = flightData.data
                                ? flightData.data
                                    .map((flight) => {
                                        return flight.itineraries?.[0]?.duration
                                            ? Number(
                                                formatDurationFromISO(
                                                    flight.itineraries[0].duration
                                                ).split("h")[0]
                                            ) + 1
                                            : 0;
                                    })
                                    .reduce((a, b) => Math.max(a, b), -1)
                                : maxDuration;
                            setMaxPrice(newMaxPrice);
                            setMaxDuration(newMaxDuration);

                            if (params.priceValue === "-1" || params.durationValue === "-1") {
                                navigate(
                                    `/results/${params.departureLocation}/${params.destinationLocation}/${params.departureDate}/${params.departureTime}/${params.isDirect}/${newMaxPrice}/${newMaxDuration}/${params.searchNonStopFlight}/${params.priceLimit}/${params.adults}/${params.travelClass}`,
                                    { replace: true }
                                );
                                // console.log("first navigate");
                                // console.log("maxPrice:" + newMaxPrice);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Error fetching flight data.");
                setFlights([]);
                setPriceAnalytics(null);
                setLoading(false);
            }
        };

        runFetch();

        const userId = localStorage.getItem("userId");
        // console.log("userId", userId);
        if (userId !== null) setLoggedIn(true);
        else setLoggedIn(false);
    }, [
        params.departureLocation,
        params.destinationLocation,
        params.departureDate,
        params.departureTime,
        params.searchNonStopFlight,
        params.priceLimit,
        params.adults,
        params.travelClass,
        useTestData,
    ]);

    useEffect(() => {
        if (params.priceValue === "-1" || params.durationValue === "-1") {
            navigate(
                `/results/${params.departureLocation}/${params.destinationLocation}/` +
                `${params.departureDate}/${params.departureTime}/${params.isDirect}/` +
                `${maxPrice}/${maxDuration}/${params.searchNonStopFlight}/` +
                `${params.priceLimit}/${params.adults}/${params.travelClass}`,
                { replace: true }
            );
            // console.log("second navigate");
            // console.log("maxPrice:" + maxPrice);
        }
    }, [maxDuration, maxPrice, params.priceValue, params.durationValue]);

    // Price Graph rankingName determination
    const priceAnalyticsData =
        priceAnalytics && priceAnalytics.data && priceAnalytics.data.length > 0
            ? priceAnalytics.data[0].priceMetrics.map((metric, index) => {
                const rankingNames = ["min", "25%", "avg", "75%", "max"];

                return {
                    quartileRanking: rankingNames[index] || metric.quartileRanking,
                    amount: parseFloat(metric.amount),
                };
            })
            : [];

    return (
        <div className="text-white h-full flex flex-row justify-center">
            <SideBar
                departureLocation={params.departureLocation}
                destinationLocation={params.destinationLocation}
                departureDate={params.departureDate}
                departureTime={params.departureTime}
                isDirect={params.isDirect}
                durationValue={params.durationValue}
                priceValue={params.priceValue}
                maxPrice={maxPrice}
                maxDuration={maxDuration}
                searchNonStopFlight={params.searchNonStopFlight}
                priceLimit={params.priceLimit}
                adults={params.adults}
                travelClass={params.travelClass}
                priceAnalyticsData={priceAnalyticsData}
            />

            <Flightlist
                departureLocation={params.departureLocation}
                destinationLocation={params.destinationLocation}
                departureDate={params.departureDate}
                departureTime={params.departureTime}
                isDirect={params.isDirect}
                durationValue={params.durationValue}
                priceValue={params.priceValue}
                flights={flights}
                loading={loading}
                error={error}
                howManyShown={howManyShown}
                showMore={showMore}
                setHowManyShown={setHowManyShown}
                loggedIn={loggedIn}
            />
        </div>
    );
}

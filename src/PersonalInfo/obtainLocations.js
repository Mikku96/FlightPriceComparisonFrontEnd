export default async function obtainLocations(flight) {
    if (Object.keys(flight).length > 0 && Object.keys(flight.flightData).length > 0
        && Object.keys(flight.flightData.itineraries).length > 0) {
        const fromIATA = flight.flightData.itineraries[0].segments[0].departure.iataCode;
        const toIATA = flight.flightData.itineraries[0]
            .segments[flight.flightData.itineraries[0].segments.length - 1].arrival.iataCode;

        const airportJSON = await fetch("/airports.json", {
            headers: {
                'Accept': 'application/json'
            }
        });
        const airportData = await airportJSON.json();
        let departureInfo = airportData.find(location => location.code === fromIATA);
        let arrivalInfo = airportData.find(location => location.code === toIATA);

        // Catch the unknown cases
        // NO needed for the actual product
        // Error should be caught before we arrive here
        if (departureInfo === undefined) {
            departureInfo = { code: fromIATA, city: "Unknown", airport: null, country: "Nowhere" }
        }
        if (arrivalInfo === undefined) {
            arrivalInfo = { code: toIATA, city: "Unknown", airport: null, country: "Nowhere" }
        }
        return [departureInfo, arrivalInfo];
    }
}
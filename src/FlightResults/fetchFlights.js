const client_id = import.meta.env.VITE_CLIENT_AMADEUS_ID;
const client_secret = import.meta.env.VITE_CLIENT_AMADEUS_SECRET;

let cachedToken = null; 
let tokenExpiry = null;

export const getAccessToken = async () => { 
    const now = new Date();

    if (cachedToken && tokenExpiry && now < tokenExpiry) { 
        return cachedToken;
    }

    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    // console.log(expiresIn + "minutes");

    if (!accessToken) {
        throw new Error('Failed to retrieve access token.');
    }

    tokenExpiry = new Date(now.getTime() + expiresIn * 1000 - 60000); // varmuuden vuoksi minuutti pois

    cachedToken = accessToken;
    
    return accessToken; 
};

const fetchFlights = async (params) => {
    // First three parameters are REQUIRED
    const depLoc = params.departureLocation; // string e.g. "HEL"
    const destLoc = params.destinationLocation; // string ^
    const depDate = params.departureDate; // string "2024-12-26"
    // Technically, amount of passengers HAVE to be given
    const adults = !isNaN(Number(params.adults)) ? params.adults : 1; // Check that the input is a number, otherwise 1
    // Optional parameters
    const travelClass = params.travelClass; // string e.g. "any"
    const nonStop = params.searchNonStopFlight; // string-boolean "true" 
    const maxPrice = params.priceLimit; // string-number "10"

    const optionalParam = [{ travelClass: travelClass }, { nonStop: nonStop }, { maxPrice: maxPrice }];

    try {
      
        const accessToken = await getAccessToken(); 

        // Generate search URL and fetch from API
        let flightOffersUrl = "https://test.api.amadeus.com/v2/shopping/flight-offers?" +
            `originLocationCode=${depLoc}&` +
            `destinationLocationCode=${destLoc}&` +
            `departureDate=${depDate}&` +
            `adults=${adults}&` +
            `currencyCode=EUR&`;

        // Adding optional parameters to URL
        for (let parameter of optionalParam) {
            for (let [key, value] of Object.entries(parameter)) {
                if (value === "false" || value === "-1") {
                    continue;
                }
                flightOffersUrl += `${key}=${value}&`;
            }
        }
        // Remove last &
        flightOffersUrl = flightOffersUrl.slice(0, -1);
        // console.log(flightOffersUrl);

        const flightResponse = await fetch(flightOffersUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(flightResponse)
        if (!flightResponse.ok) {
            throw new Error('Failed to fetch flight data.');
        }

        const flightData = await flightResponse.json();
        // console.log(flightData);
        
        const priceAnalyticsUrl = `https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=${depLoc}&destinationIataCode=${destLoc}&departureDate=${depDate}&currencyCode=EUR`;
        const priceAnalyticsResponse = await fetch(priceAnalyticsUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Muutos
                'Content-Type': 'application/json',
            },
        });

        if (!priceAnalyticsResponse.ok) {
            throw new Error('Failed to fetch price analytics data.');
        }

        const priceAnalyticsData = await priceAnalyticsResponse.json();
        
        // console.log('Price Analytics Data:', priceAnalyticsData);

        return {
            flightData,
            priceAnalyticsData,
        };
    } catch (error) {
        console.error('error:', error);
        return 'error.';
    }
};

export default fetchFlights;
# API Documentation

This documentation outlines the information used from various APIs in our application. In the first section, we focus on the Amadeus.

## 1. Amadeus API

Amadeus is a global travel technology company that offers a wide range of API endpoints for accessing data related to flights, hotels, car rentals, and other travel services. The actual list of airports which it covers is not published. In our application, we utilize the following Amadeus API endpoints and the data they provide.

### Used Endpoints:

#### Flight Offers Search API

This API allows searching for flight offers based on specific search criteria. The prices are real in the sense that prices are cheapest for the date in question but the real actual price has to be confirmed using POST method (not implemented yet).

- **Endpoint:** `/v2/shopping/flight-offers`
- **Purpose:** To perform searches for available flight offers based on user-defined criteria (e.g., departure and arrival locations, dates, travel classes, etc).

#### Flight Price Analysis API

This API provides AI-analyzed data (according to Amadeus) in conjunction with flight booking data from 2019. The exact process and algorithm used to generate this data are unknown to the participants in this project.

- **Endpoint:** `/v1/analytics/itinerary-price-metrics`
- **Purpose:** For a given city pair and departure date, the API provides historical prices in a quartile distribution, including minimum, maximum, and average price. This helps users assess if they are getting a good deal on a flight.

#### Flight Delay API

This API provides delay data.

- **Endpoint:** `/v1/travel/predictions/flight-delay`
- **Purpose:** To provide information about how much delay one can expect for a certain flight.

### Used Data

Below is a list of the data we use from the Amadeus API and their purposes within our application.

| Description                                     | API Endpoint                | Location                                                         |
|-------------------------------------------------|-----------------------------|------------------------------------------------------------------|
| Total price of the flight offer                 | Flight offers search API    | `flight.price.total`                                             |
| Currency of the prices                          | Flight offers search API    | `flight.price.currency`                                          |
| Number of bookable seats                        | Flight offers search API    | `flight.numberOfBookableSeats`                                   |
| Flight itineraries                              | Flight offers search API    | `flight.itineraries`                                             |
| Total duration of the journey in ISO format     | Flight offers search API    | `flight.itineraries[0].duration`                                 |
| Individual flight segments of the itinerary     | Flight offers search API    | `flight.itineraries[0].segments`                                 |
| IATA code of the departure airport              | Flight offers search API    | `flight.itineraries[0].segments[].departure.iataCode`            |
| Departure time in ISO format                    | Flight offers search API    | `flight.itineraries[0].segments[].departure.at`                  |
| IATA code of the arrival airport                | Flight offers search API    | `flight.itineraries[0].segments[].arrival.iataCode`              |
| Arrival time in ISO format                      | Flight offers search API    | `flight.itineraries[0].segments[].arrival.at`                    |
| IATA code of the airline                        | Flight offers search API    | `flight.itineraries[0].segments[].carrierCode`                   |
| Flight number                                   | Flight offers search API    | `flight.itineraries[0].segments[].number`                        |
| Duration of the flight segment                  | Flight offers search API    | `flight.itineraries[0].segments[].duration`                      |
| Traveler pricing information                    | Flight offers search API    | `flight.travelerPricings`                                        |
| Travel class (e.g., Economy, Business)          | Flight offers search API    | `flight.travelerPricings[0].fareDetailsBySegment[].cabin`        |
| Price quartile distribution                     | Price analytics API         | `data.priceMetrics.quartiles`                                    |
| Predicted delay information                     | Flight delay API            | `data[].probability.delay`                                         |

## 2. Weather API

WeatherAPI is a robust provider of weather and geolocation APIs, offering a comprehensive range of services. These include real-time weather data, weather forecasts, historical weather information, air quality data, and so on.

### Used Endpoints:

#### Forecast API

This endpoint provides weather forecasts for a given location, including daily and hourly forecasts. It also supports querying for historical weather data by specifying a date.

- **Endpoint:** `/v1/forecast.json`
- **Purpose:** To retrieve weather forecasts or historical weather data for a specific location and date.

#### Parameters:

| Parameter  | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `key`      | (Required) Your API key for authenticating requests.                        |
| `q`        | (Required) Location query (city name, postal code, or coordinates).          |
| `dt`       | (Optional) Specific date for which weather data is requested (YYYY-MM-DD).   |


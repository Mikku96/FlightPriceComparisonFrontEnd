# Price Comparison Frontend - A three week Scrum project

Made during Buutti's Web-dev Front End course. Check out [my selected few works](https://github.com/Mikku96/Front-End-WebDev-Assignments) from the course, or a former more free-form one week [group project](https://github.com/Mikku96/ForumFrontEnd).

## Description
React based Frontend utilizing [Amadeus](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search)
for finding flight offers and flight price data. [Weather API](https://www.weatherapi.com/) is used to get weather for the given arrival date and location. User of the site will be able to log in and save flights to their own wishlist.
The backend where user information is saved can be found [here](https://gitlab.com/JaniA/price-comparison-backend).

![screenshot](/public/screenshot-2024-12-13-140848.png)

**Installation and running** (for testing locally; one also needs API keys for Amadeus and Weather API in order to achieve full functionality):  

- Clone the project
- `npm install`
- `npm run dev` 

Even if you do not have the API keys, you can use test data. This is automatically enabled and can be switched off when the website loads. 
Test data corresponds to HEL-CAI flight on 28.11, Economy flight. You do not have to enter "HEL" and "CAI" as departure and arrival locations.

## NOTE about Login and our Back End
Our own Back End is hosted with Render, and technically one can try to log in, add flights to wishlist etc. The only setback is that
Render takes a minute to spin up, so logging in may appear to be stuck. This is the limitation of the free Render hosting.

This usually resolves after approximately one minute after trying to log in the first time - assuming that the Back end is even still being hosted
at the time of your test.

## Structure

```plaintext
price-comparison-frontend/                    
|
├── public/
|   |
|   ├── airlines.js       
.   └── airports.js      
.   └── airports.json   
.   └── HEL_CAI_28_11.json  # example response
.   └── HEL_OSL_27_11.json  # example response
|   └── plane.ico       
|
|
├── src/
|   .
|   .                   
│   └── Comparison/                            
│   ├── main.jsx          
│   └── custom-hooks/
    |   └── useAutoComplete.jsx
|   └── data/   
|       └── countries.js
        └── iacConverter.js
        └── iata-airport-codes.txt
    .  
    .  
|   └── FlightResults/
    .   | 
        └── fetchFlights.js
        └── Flightlist.jsx
        └── FlightResults.jsx
        └── Orderby.jsx
    .   └── orderFunction.js
    .   └── Sidebar.jsx
|   |
|   └── Header/
|   └── Modal/
|   └── PersonalInfo/
|
|
|
├── Button.jsx
├── Errorpage.jsx   
├── FlightDetails.jsx
├── README.md             # this file        
├── formatters.js            
├── main.jsx         
├── Singleflight.jsx         
├── APIdocumentation.md          
├── tailwind.config.js
├── package.json          # dependencies
├── package-lock.json     
.
. 



``` 

## Contributors

Erno Kauranen, Jani Aalto, Jenni Laakso, Miikka Siitonen
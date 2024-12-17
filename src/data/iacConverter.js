import fs from "fs";

import countries from "./countries.js";

//console.log(countries);

const airportData = fs.readFileSync("./iata-airport-codes.txt", "utf-8");

const lines = airportData.trim().split('\n');

// Process each line to extract relevant information
const airports = lines.map(line => {
    // Split the line into parts based on the last comma
    const lastCommaIndex = line.lastIndexOf(',');
    
    // Divide by last ","
    const mainPart = line.substring(0, lastCommaIndex).trim();
    let country = line.substring(lastCommaIndex + 1).trim();
    if (country === "USA" || 
        country === "Wake Island" || 
        country === "Baker Island"){
        country = "United States";
    } if (country === "Guadeloupe" ||
        country === "Mayotte" ||
        country === "Saint Pierre and Miquelon" ||
        country === "Wallis and Futuna Islands") {
        country = "France";
    }
    if (country === "Channel Islands") {
        country = "United Kingdom";
    }
    if (country === "U.S. Virgin Islands") {
        country = "Virgin Islands"
    }
    if (country === "Spanish Morocco") {
        country = "Spain"
    }

    // Extract the airport code (first word) and the rest (city and extra)
    const [code, ...rest] = mainPart.split('\t');
    const cityAndExtra = rest.join(' '); // Join the rest back into a single string
    //console.log(cityAndExtra)
    
    // Separate the city and extra information if present
    const cityMatch = cityAndExtra.match(/^(.+?)(?:\s+\[(.+?)\])?$/);
    const city = cityMatch ? cityMatch[1].trim() : cityAndExtra;
    const airport = cityMatch && cityMatch[2] ? cityMatch[2].trim() : null;

    // Add the two letter country code
    let countryCode = Object.keys(countries).find(key => country === countries[key]);


    if (countryCode === undefined) {
    }

    return {
            code,
            city,
            airport,
            country,
            countryCode
    }
});

// console.log(airports);

fs.writeFileSync('airports.json', JSON.stringify(airports,  null, 4), "utf-8");
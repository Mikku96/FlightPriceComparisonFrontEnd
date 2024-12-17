import { formatDurationFromISO } from "../formatters.js";

const calculateTime = flight => {
  const flightTimeHours = Number(
    formatDurationFromISO(flight.itineraries[0].duration).split("h")[0]
  );
  const aTimeMinutes = Number(
    formatDurationFromISO(flight.itineraries[0].duration)
      .split("h")[1]
      .split("m")[0]
  );

  return flightTimeHours * 60 + aTimeMinutes;
};

const clockTime = flight => {
  const time = flight.itineraries[0].segments[0].departure.at
    .split("T")[1]
    .split(":");
  return Number(time[0]) * 3600 + Number(time[1]) * 60 + Number(time[2]);
};

const orderFunction = orderBy => {
  return function(a, b) {
    // If we are comparing by PRICE
    if (orderBy === "cheapestFirst" || orderBy === "expensiveFirst") {
      if (Number(a.price.total) < Number(b.price.total)) {
        return orderBy === "cheapestFirst" ? -1 : 1;
      } else if (Number(a.price.total) > Number(b.price.total)) {
        return orderBy === "cheapestFirst" ? 1 : -1;
      }
      return 0;

      // Comparing by TOTAL TIME
    } else if (orderBy === "shortestFirst" || orderBy === "longestFirst") {
      // Need to convert hours to minutes "5h20m" -> 5*60 + 20
      const aTime = calculateTime(a);
      const bTime = calculateTime(b);

      if (aTime < bTime) {
        return orderBy === "shortestFirst" ? -1 : 1;
      } else if (aTime > bTime) {
        return orderBy === "shortestFirst" ? 1 : -1;
      }
      return 0;
      // Comparing by DEPARTURE TIME
    } else if (orderBy === "earliestFirst" || "latestFirst") {
      // Need to convert 10:15:20 to seconds since midnight:  10*3600 + 15*60 + 20
      const aTime = clockTime(a);
      const bTime = clockTime(b);

      if (aTime < bTime) {
        return orderBy === "earliestFirst" ? -1 : 1;
      } else if (aTime > bTime) {
        return orderBy === "earliestFirst" ? 1 : -1;
      }
    }
  };
};

export default orderFunction;

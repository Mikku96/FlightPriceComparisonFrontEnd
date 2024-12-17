import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Component imports
import MainHeader from "./Header/MainHeader.jsx";
import FlightResults, {
  loader as pageLoader,
} from "./FlightResults/FlightResults.jsx";
import Errorpage from "./Errorpage.jsx";
import FlightDetails from "./FlightDetails.jsx";
import PersonalInfo from "./PersonalInfo/PersonalInfo.jsx";
import FlightComparison from "./Comparison/FlightComparison.jsx";

// Styling import
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainHeader />,
    loader: pageLoader,
    errorElement: <Errorpage />,
    children: [
      {
        path:
          "/results" +
          "/:departureLocation" +
          "/:destinationLocation" +
          "/:departureDate" +
          "/:departureTime" +
          "/:isDirect" +
          "/:priceValue" +
          "/:durationValue" +
          "/:searchNonStopFlight" +
          "/:priceLimit" +
          "/:adults" +
          "/:travelClass",
        element: <FlightResults />,
        loader: pageLoader,
      },
      {
        path: "/flightDetails/:uuid",
        element: <FlightDetails />,
        loader: pageLoader,
      },
      {
        path: "/personalInfo",
        element: <PersonalInfo />,
        loader: pageLoader,
      },
      {
        path: "/compare",
        element: <FlightComparison />,
        loader: pageLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

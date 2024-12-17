import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function SideBar({
  departureLocation,
  destinationLocation,
  departureDate,
  departureTime,
  isDirect,
  durationValue,
  priceValue,
  maxPrice,
  maxDuration,
  searchNonStopFlight,
  priceLimit,
  adults,
  travelClass,
  priceAnalyticsData,
}) {
  const [isChecked, setChecked] = useState(isDirect === "true");
  const [DurationValue, setDuration] = useState(durationValue);
  const [PriceValue, setPrice] = useState(priceValue);

  useEffect(() => {
    setChecked(isDirect === "true");
    setDuration(durationValue);
    setPrice(priceValue);
  }, [
    departureDate,
    departureLocation,
    departureTime,
    destinationLocation,
    isDirect,
    durationValue,
    priceValue,
    searchNonStopFlight,
    priceLimit,
    adults,
    travelClass,
  ]);

  let navigate = useNavigate();

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
    navigate(
      `/results/${departureLocation}/${destinationLocation}/${departureDate}/${departureTime}/${!isChecked}/${PriceValue}/${DurationValue}/${searchNonStopFlight}/${priceLimit}/${adults}/${travelClass}`
    );
  };

  const handlePriceChange = (e) => {
    setPrice(() => e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(() => e.target.value);
  };

  const handleMouseUp = () => {
    navigate(
      `/results/${departureLocation}/${destinationLocation}/${departureDate}/${departureTime}/${isChecked}/${PriceValue}/${DurationValue}/${searchNonStopFlight}/${priceLimit}/${adults}/${travelClass}`
    );
  };

  return (
    <div className="flex flex-col gap-y-10 w-3/12 m-5 ">
      <h2 className="text-xl font-bold">Filters</h2>
      <div>
        <div>
            <label>
            <input
                className="mb-5 accent-slate-700"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={searchNonStopFlight === "true"}
            />
            Direct Flights Only
            </label>
        </div>

        <div className="flex flex-col mb-5">
            <label>max Price: {PriceValue}</label>
            <input
            className="w-full accent-slate-300"
            type="range"
            min="1"
            max={maxPrice}
            step="1"
            value={PriceValue}
            onChange={handlePriceChange}
            onMouseUp={handleMouseUp}
            />
        </div>

        <div className="flex flex-col">
            <label>max Duration: {DurationValue} hours</label>
            <input
            className="w-full accent-slate-300"
            type="range"
            min="1"
            max={maxDuration}
            step="1"
            value={DurationValue}
            onChange={handleDurationChange}
            onMouseUp={handleMouseUp}
            />
        </div>
      </div>

      <div>
        {priceAnalyticsData && priceAnalyticsData.length > 0 ? (
            <div>
            <h2 className="text-xl font-bold">Price quartiles</h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                data={priceAnalyticsData}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quartileRanking" tick={{ fill: "black" }} />
                <YAxis tick={{ fill: "black" }}>
                    <Label
                    value="Price (€)"
                    angle={-90}
                    position="insideLeft"
                    className="fill-black"
                    />
                </YAxis>
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex items-center justify-center h-300">
            <span className="text-xl text-[rgb(255,0,0)] font-bold"
            >
                (no quartile data available)
            </span>
            </div>
        )}
      </div>

    </div>
  );
}

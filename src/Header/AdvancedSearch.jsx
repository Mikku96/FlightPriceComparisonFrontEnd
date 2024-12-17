export default function AdvancedSearch({ searchObject, updateSearchObject }) {
  return (
    <>
      <div className="flex flex-col w-5/12">
        <label>Adults:</label>
        <input
          className="w-full"
          type="text"
          name="adults"
          value={searchObject.adults}
          onChange={(event) => updateSearchObject(event)}
        />
      </div>

      <div className="flex flex-col w-5/12">
        <label>Max Price (€):</label>
        <input
          className="w-full"
          type="text"
          name="priceLimit"
          value={searchObject.priceLimit}
          onChange={(event) => updateSearchObject(event)}
        />
      </div>

      <div className="flex flex-col w-10/12">
        <label>Preferred Minimum Travel Class:</label>
        <select
          name="travelClass"
          value={searchObject.travelClass}
          onChange={(event) => updateSearchObject(event)}
        >
          <option value="ECONOMY">Economy</option>
          <option value="PREMIUM_ECONOMY">Premium Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First Class</option>
        </select>
      </div>

      <label>
        <input
          className="m-2"
          type="checkbox"
          name="searchNonStopFlight"
          checked={searchObject.searchNonStopFlight === "true"}
          onChange={updateSearchObject}
        />
        Direct Flights Only
      </label>
    </>
  );
}

// Component that let's the user re-order flights
// By price, flight time etc. (expandable technically)

export default function OrderBy({orderBy, updateOrder}) {

    return (
        <>
        <div className="flex flex-col gap-y-4 w-2/6 justify-items-end text-black">
            <label className="text-xl text-white font-bold">
                Sort by
            </label>
            <select
                className="pl-1"
                name="orderList"
                value={orderBy}
                onChange={(event) => updateOrder(event.target.value)}>
                <option value="cheapestFirst">Cheapest</option>
                <option value="expensiveFirst">Most Expensive</option>
                <option value="shortestFirst">Shortest Travel Time</option>
                <option value="longestFirst">Longest Travel Time</option>
                <option value="earliestFirst">Earliest Departure</option>
                <option value="latestFirst">Latest Departure</option>
            </select>
        </div>
        </>
    );
}

import React from "react";
import { TbBuildingAirport } from "react-icons/tb";
import { FaPlaneArrival } from "react-icons/fa6";
import ReactCountryFlag from "react-country-flag";

import useAutoComplete from "../custom-hooks/useAutoComplete.jsx";

import airports from "../../public/airports.js";

//https://paulallies.medium.com/how-to-build-a-react-autocomplete-component-31085bf0c82b

// As a self-stipulation, the code below has been commented TO UNDERSTAND it

export default function AutoCompleteField({ placeHolder, name, onChoose, defaultValue, value }) {
    // Options contains objects to be used in check
    // Stock "Options" had "value" and "label" keys
    // value functioned as an "ID", label was the actual key-value that was used
    // in comparing user input
    /*const Options = [
          { value: "1", label: "John" },
          { value: "2", label: "Jack" },
          { value: "3", label: "Jane" },
          { value: "4", label: "Mike" },
      ];*/

    const Options = airports;

    // We obtain following "variables" and functions from "useAutoComplete":
    //############################################################
    // bindInput:

    // The input field logic basically - holds the chosen input!
    // ALSO Holds special function "onKeyDown", which transcribes
    // certain user buttons to browsing
    // e.g. Pressing ESCAPE" -> Clear suggestions
    // Pressing "Enter" -> selectOption that is highlighted(?)
    //############################################################
    // bindOptions:

    // A mutable object which holds the current
    // offered suggestion OPTIONS (not the actual list)
    // Used in <ul>
    //############################################################
    // bindOption:

    //  'onClick' when user clicks an option in the current SHOWN list
    // -> Leads to onChange
    // -> and Setting of the clicked value to the text-field
    //############################################################
    // isBusy:

    // State which holds info about if we are
    // waiting for "loading" of suggestions
    //############################################################
    // suggestions:

    // After input, we "getSuggestions" based on the input
    // -> We call the below "source" function with
    //############################################################
    // selectedIndex:

    // When user interacts with "bindOption"
    // set the index of the CLOSEST <li> element to state
    //############################################################

    // useAutoComplete takes in "onChange" function which describes what happens during input
    // In this case, we print

    // Secondly, "source" is the filtering function that finds suggestions from our Options array
    // based on the input user has given
    const {
        bindInput,
        bindOptions,
        bindOption,
        isBusy,
        suggestions,
        selectedIndex
    } = useAutoComplete({
        onChange: airportObject => {
            onChoose(airportObject, name);
        }, // value is the AIRPORT object
        source: search => {
            if (search.length < 3) {
                return Options.filter(option =>
                    new RegExp(`^${search}`, "i").test(option.code)
                );
            } else if (search.length === 3) {
                return Options.filter(option => {
                    if (
                        new RegExp(`^${search}`, "i").test(option.code) ||
                        new RegExp(`^${search}`, "i").test(option.country)
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else if (search.length > 3) {
                return Options.filter(option =>
                    new RegExp(`^${search}`, "i").test(option.country)
                );
            }
        },
        defaultValue,
        value
    });
    return (
        <div className="p-2 border">
            <div className="flex items-center w-full">
                {name === "departureLocation" && <TbBuildingAirport />}
                {name === "destinationLocation" && <FaPlaneArrival />}
                <input
                    placeholder={placeHolder}
                    className="flex-grow px-1 outline-none bg-transparent"
                    {...bindInput}
                />
                {isBusy &&
                    <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin" />}
            </div>
            <ul
                {...bindOptions}
                className="w-[300px] scroll-smooth absolute max-h-[260px] overflow-x-hidden overflow-y-auto bg-white bg-opacity-90 rounded-md cursor-pointer z-10"
            >
                {suggestions.map((_, index) =>
                    <li
                        className={
                            `flex items-center p-1 hover:bg-slate-300 ` +
                            (selectedIndex === index && "bg-slate-300")
                        }
                        key={index}
                        {...bindOption}
                    >
                        <div className="flex items-center space-x-1">
                            <ReactCountryFlag countryCode={suggestions[index].countryCode} />
                            <div className="flex">
                                {suggestions[index].code} - {suggestions[index].city}
                                {suggestions[index].airport &&
                                    <>
                                        {" - "}
                                        {suggestions[index].airport}
                                    </>
                                    } 
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

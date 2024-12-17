import { useEffect, useRef, useState } from 'react'

// Transcribe hotkeys for ease-of-use
const KEY_CODES = {
    "DOWN": 40,
    "UP": 38,
    "PAGE_DOWN": 34,
    "ESCAPE": 27,
    "PAGE_UP": 33,
    "ENTER": 13,
}

export default function useAutoComplete({ delay = 500, source, onChange, defaultValue, value }) {
    // Delay is a prop that describes a STATIC time before
    // updating the suggestions
    // It is set within delayInvoke function
    // which is called when user inputs anything

    // Time out state (explained ^)
    const [myTimeout, setMyTimeOut] = useState(setTimeout(() => { }, 0))
    // isBusy describes, if we are "waiting" for suggestions from Options array
    const [isBusy, setBusy] = useState(false)

    // useRef creates a mutable object
    // It is hold in memory as long as the COMPONENT is rendered
    // In this case, it holds info/options about the shown <ul>
    const listRef = useRef()

    // These are self-explanatory
    const [suggestions, setSuggestions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [textValue, setTextValue] = useState("")

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    // "Wait" for options to be loaded
    function delayInvoke(cb) {
        if (myTimeout) {
            clearTimeout(myTimeout)
        }
        setMyTimeOut(setTimeout(cb, delay));
    }

    // When an option is chosen, save the index and remove all suggestions
    function selectOption(index) {
        if (index > -1) {
            onChange(suggestions[index])
            setTextValue(suggestions[index].code)
        }
        clearSuggestions()
    }

    // Obtain suggestions using source function
    // which is given as a prop (filtering)
    async function getSuggestions(searchTerm) {
        if (searchTerm && source) {
            const options = await source(searchTerm)
            setSuggestions(options)
        }
    }

    // After user chooses or escapes, clear suggestions
    function clearSuggestions() {
        setSuggestions([])
        //setSelectedIndex(-1)
    }

    // Update text box, start "waiting" for suggestions
    // after waiting, load the suggestions to be shown
    function onTextChange(searchTerm) {
        setBusy(true)
        setTextValue(searchTerm?.toUpperCase())
        onChange(searchTerm)
        clearSuggestions();
        delayInvoke(() => {
            getSuggestions(searchTerm)
            setBusy(false)
        });
    }

    // Here, things get confusing...
    // We obtain height of a single list element
    // Set it to optionHeight
    // listRef is used in <ul> so it obtains the height
    // from the FIRST child of it (<li>) I assume!
    // Of course, this is only done when user has done an input
    // Otherwise the optionHeight is null/undefined/0
    const optionHeight = Number(listRef?.current?.children[0]?.clientHeight);

    function scrollUp() {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1)
        }
        // When user scrolls up, decrease current value of scrollTop
        // 0 -> At the top, so each scroll moves elements up by ONE element height
        // in the shown list
        listRef.current.scrollTop -= optionHeight
    }

    function scrollDown() {
        if (selectedIndex < suggestions.length - 1) {
            setSelectedIndex(selectedIndex + 1)
        }
        // Current selected (top-most?) suggestion * single height
        // is our new position from the top of the list
        listRef.current.scrollTop = selectedIndex * optionHeight
    }

    function pageDown() {
        setSelectedIndex(suggestions.length - 1)
        // Go to the end of the list (last suggestion)
        listRef.current.scrollTop = suggestions.length * optionHeight
    }

    function pageUp() {
        setSelectedIndex(0)
        listRef.current.scrollTop = 0
    }

    // Everytime user presses ANYTHING
    // We run functions depending on the key
    // These were set at the beginning of this file
    function onKeyDown(e) {
        const keyOperation = {
            [KEY_CODES.DOWN]: scrollDown,
            [KEY_CODES.UP]: scrollUp,
            [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
            [KEY_CODES.ESCAPE]: clearSuggestions,
            [KEY_CODES.PAGE_DOWN]: pageDown,
            [KEY_CODES.PAGE_UP]: pageUp,
        }
        if (keyOperation[e.keyCode]) {
            keyOperation[e.keyCode]()
        } else {
            setSelectedIndex(-1)
        }
    }

    const handleClick = () => {
        if (textValue === "" || textValue === undefined)
            onTextChange(defaultValue);
    }

    // The following returned functions/variables/parameters
    // are explained in AutoCompleteField.jsx
    return {
        bindOption: {
            onClick: e => {
                let nodes = Array.from(listRef.current.children);
                selectOption(nodes.indexOf(e.target.closest("li")))
            },
        },
        bindInput: {
            value: textValue,
            onChange: e => onTextChange(e.target.value),
            onKeyDown,
            onBlur: () => setTimeout(() => {
                clearSuggestions()
            }, 500),
            onClick: handleClick
        },
        bindOptions: {
            ref: listRef
        },
        isBusy,
        suggestions,
        selectedIndex,
    }
}
export default function Button({
  tailWindClass = "",
  buttonName,
  runFunction,
  type,
  submitValue = "Submit",
  isDisabled = false,
}) {
  
  // Stock Tailwind styling
  const buttonStyling = `
  uppercase font-sans
  bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500
  backdrop-blur-lg
  rounded-full
  text-sm text-white font-semibold
  p-4 m-2 px-5
  flex items-center justify-center
  h-10 align-middle
  shadow-xl
  transition-all duration-300 ease-in-out
  focus:outline-none focus:ring-4 focus:ring-violet-400/60
  active:translate-y-1 active:shadow-lg
  disabled:opacity-50 disabled:cursor-not-allowed
  border border-solid border-white/30
  ${tailWindClass}
  relative overflow-hidden
 hover:via-purple-700 hover:to-indigo-500
`;

  return (
    <>
      {type === "button" && (
        <button
          className={buttonStyling}
          onClick={runFunction}
          disabled={isDisabled}
        >
          {buttonName}
        </button>
      )}
      {type === "submit" && (
        isDisabled === true ?
          <input
            className={tailWindClass + " opacity-50"}
            type="submit"
            value={submitValue}
            disabled={isDisabled}
          />
          :
          <input
            className={tailWindClass + " hover:via-purple-700 hover:to-indigo-500"}
            type="submit"
            value={submitValue}
            disabled={isDisabled}
          />
      )}
    </>
  );
}

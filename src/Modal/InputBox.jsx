export default function InputBox({ tailWindClass = "", typeOf, value, onChange,
    boxName, placeholder, maxLength }) {

    const inputStyling =
        `font-mono
        text-black
        placeholder:text-gray-400
        bg-slate-300
        rounded-xl border-white
        border-2 border-solid
        text-xs p-1 m-1
        h-6 w-full` + " " +
        tailWindClass;

    return (
        <div className="flex flex-col gap-y-8 w-6/12 m-3">
            <label className="text-white">
                {boxName}
                <input
                    className={inputStyling}
                    type={typeOf}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                />
            </label>
        </div>
    );
}

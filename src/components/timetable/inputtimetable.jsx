export const Inputtimetable = ({value, disabled, label}) => {
    return (
        <div className="flex flex-col">
            <label className="text-xs font-light ">{label}</label>
            <input className="mt-1 px-2 py-1 border rounded-sm" type="text" value={value} disabled={disabled} />
        </div>
    );
};
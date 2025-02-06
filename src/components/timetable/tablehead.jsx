export const    TableHead = ({timelist}) => {
    return (
        <thead className="ltr:text-left rtl:text-right bg-background-alt">
            <tr className="h-11 text-white">
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>คาบที่</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>1</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>2</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>3</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>4</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>พักเที่ยง</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>5</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>6</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>7</span>
                </th>
            </tr>
            <tr className="h-11 shadow-md ">
                <th className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    <span>เวลา</span>
                </th>
                {timelist.map((time, index) => (
                    <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-white">
                        <span>{time}</span>
                    </th>
                ))}
            </tr>
        </thead>
    );
};
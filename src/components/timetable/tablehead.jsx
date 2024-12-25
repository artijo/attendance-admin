export const TableHead = ({timelist}) => {
    return (
        <thead className="ltr:text-left rtl:text-right">
            <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>คาบที่</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>1</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>2</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>3</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>4</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>พักเที่ยง</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>5</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>6</span>
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>7</span>
                </th>
            </tr>
            <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <span>เวลา</span>
                </th>
                {timelist.map((time, index) => (
                    <th key={index} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        <span>{time}</span>
                    </th>
                ))}
            </tr>
        </thead>
    );
};
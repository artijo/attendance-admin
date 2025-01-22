function Noanything({title, description}) {
    return (
        <div className="w-full flex flex-col gap-5 justify-center items-center mt-10">
            <h1 className="drop-shadow-lg text-gray-700">{title}</h1>
            <p className="text-gray-600 shadow-lg border rounded-md bg-white p-5"><span className="text-red-600">รายละเอียด</span><br/>{description}</p>
        </div>
    );
};

export default Noanything;
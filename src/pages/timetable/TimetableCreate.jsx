import { useState } from "react";

function TimetableCreate() {
    const [monday, setMonday] = useState([]);
    const [tuesday, setTuesday] = useState([]);
    const [wednesday, setWednesday] = useState([]);
    const [thursday, setThursday] = useState([]);
    const [friday, setFriday] = useState([]);

    const [isPopUp, setIsPopUp] = useState(false);

    function PopUp(){
        return(
            <div>
                PopUp
            </div>
        );
    };


    function AddButton(){
        return (
            <button className="flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        );
    };

    return(
        <>

            <div className="container mx-auto">
                <div className="flex gap-2">
                    <h5>วันจันทร์</h5>
                    <AddButton/>
                </div>

                <div className="flex gap-2">
                    <h5>วันอังคาร</h5>
                    <AddButton day={setTuesday}/>
                </div>

                <div className="flex gap-2">
                    <h5>วันพุธ</h5>
                    <AddButton day={setWednesday}/>
                </div>

                <div className="flex gap-2">
                    <h5>วันพฤหัสบดี</h5>
                    <AddButton day={setThursday}/>
                </div>

                <div className="flex gap-2">
                    <h5>วันศุกร์</h5>
                    <AddButton day={setFriday}/>
                </div>
            </div>
        </>
        
    );
};

export default TimetableCreate;


import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../../config";

function SelectTerm({ selectedTerm, setSelectedTerm,setTermInformation, nextStep }) {
    const [termlists, setTermLists] = useState([]);
    

    
    const getTermList = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/academicterms`);
            setTermLists(response.data);
        } catch (error) {
            console.error(error);
        };
    };

    const handleValueChange = (termId) => {
        const termInfo = termlists.find((term) => term.termId === termId);
        setTermInformation(termInfo)
        setSelectedTerm(termId);
    };

    useEffect(() => {
        getTermList();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <p className="font-medium">เทอมและปีการศึกษา</p>
            <select
                defaultValue="default"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm 
             focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                onChange={(e) => handleValueChange(e.target.value)}
            >
                <option value="default" disabled>
                    กรุณาเลือกเทอมและปีการศึกษา
                </option>
                {termlists.length > 0 &&
                    termlists.map((term, index) => (
                        <option value={term.termId} key={index}>
                            {`ปีการศึกษา ${term.academicYear + 543} เทอม ${term.semester}`}
                        </option>
                ))}
            </select>

            <button
                onClick={() => nextStep()}
                className="inline-flex justify-center items-center gap-2 px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
                ถัดไป      
            </button>
        </div>
    );
}

export default SelectTerm;

import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";

export const SubjectDetail = ({ subject, time }) => {
    const [subjectInfo, setSubjectInfo] = useState({});


    const fetchSubjectData = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/subject/${subject}`);
            setSubjectInfo(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (subject){
            fetchSubjectData();
        }
    }, [subject, time]);

    return (
        <div className="bg-yellow-300 text-yellow-900 p-4 rounded-md shadow-lg">
            {
                Object.keys(subjectInfo).length > 0 && (
                    <>
                        <div>
                            <p className="text-sm font-bold mb-2">{subjectInfo.subCode}</p>
                            <p className="text-xs ">ครู{subjectInfo.teacher.fName}</p>
                        </div>
                    </>
                )
            }
        </div>
        // <div className="relative w-64 h-64 bg-yellow-300 text-yellow-900 p-4 rounded-md shadow-lg">
        //     <h1 className="text-lg font-bold mb-2">Sticky Note</h1>
        //     <p className="text-sm">
        //         Remember to check the deadlines and update the progress report!
        //     </p>
        //     {/* Corner fold */}
        //     <div className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-400 rounded-bl-md transform origin-bottom-right rotate-45 -translate-x-6 translate-y-6"></div>
        // </div>


    );
};
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
    

    );
};
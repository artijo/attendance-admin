import axios from "axios";
import { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";

export const SubjectDetail = ({ subject, time , day}) => {
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

    // const spanDay = (day) => {
    //     switch (day) {
    //         case 1: // จันทร์ (เหลือง)
    //             return "cursor-pointer bg-yellow-200 text-yellow-600 px-5 py-[2px] rounded-sm";
    //         case 2: // อังคาร (ชมพู)
    //             return "cursor-pointer bg-pink-200 text-pink-600 px-5 py-[2px] rounded-sm";
    //         case 3: // พุธ (เขียว)
    //             return "cursor-pointer bg-green-200 text-green-600 px-5 py-[2px] rounded-sm";
    //         case 4: // พฤหัสบดี (ส้ม)
    //             return "cursor-pointer bg-orange-200 text-orange-600 px-5 py-[2px] rounded-sm";
    //         case 5: // ศุกร์ (ฟ้า)
    //             return "cursor-pointer bg-blue-200 text-blue-600 px-5 py-[2px] rounded-sm";
    //         default:
    //             return "cursor-pointer bg-gray-200 text-gray-600 px-5 py-[2px] rounded-sm"; // ค่าเริ่มต้น (สีเทา)
    //     }
    // };
    

    return (
        <div className={`flex justify-center items-center w-24 h-24 border bg-slate-100 rounded-sm`}>
            {
                Object.keys(subjectInfo).length > 0 && (
                    <>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold">{subjectInfo.subCode}</p>
                            <p className="text-xs ">ครู{subjectInfo.teacher.fName}</p>
                        </div>
                    </>
                )
            }
        </div>
    

    );
};
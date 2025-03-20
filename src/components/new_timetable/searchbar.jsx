import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { nameFormat } from "../../helper.js"
// ...existing code...
import closeicon from '/ico/closeicon.svg';
// ...existing code...

function Searchbar({valueSetSelectedSubject}){
    const [subjectList, setSubjectList] = useState([]);
    const [value, setValue] = useState("");
    const [isSearchPopUp, setIsSearchPopUp] = useState(false);

    const fetchSubjectList = async (value) => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/subjects`);
            const result = response.data.filter((subject) => {
                return (
                    subject &&
                    subject.teacher.fName.toLowerCase().includes(value.toLowerCase()) ||
                    subject.teacher.lName.toLowerCase().includes(value.toLowerCase()) ||
                    subject.subCode.toLowerCase().includes(value.toLowerCase()) ||
                    subject.subNameThai.toLowerCase().includes(value.toLowerCase()) ||
                    subject.subNameEng.toLowerCase().includes(value.toLowerCase()) ||
                    nameFormat(subject.teacher.fName, subject.teacher.lName).toLowerCase().includes(value.toLowerCase())
                );
            });
            // console.log(result);
            setSubjectList(result);
        } catch (error) {
            console.error(error);
        };
    };
    
    const handleChange = (value) => {
        setValue(value);
        fetchSubjectList(value);    
    };
    
    const handleSelectSubject = (sub) => {
        valueSetSelectedSubject(sub);
        setIsSearchPopUp((prevState) => !prevState);
    };


    return (
        <div>
            <div
                className="flex justify-center items-center cursor-pointer px-2 h-6 text-xs text-white font-medium border border-blue-500 rounded-md bg-blue-500 "
                onClick={() => setIsSearchPopUp((prevState) => !prevState)}
            >
                เลือกวิชา
            </div>
            {isSearchPopUp && 
                <div className="fixed z-50 bg-black bg-opacity-10 top-0 left-0 w-full h-screen flex justify-center items-center">
                    <div className=" w-1/2 p-5 grid grid-cols-1 border rounded-2xl bg-white">
                        <div className="flex justify-between">
                            <h1 className="text-center text-base font-bold">ค้นหาวิชา</h1>
                            <div className="hover:text-rose-600 hover:cursor-pointer" onClick={() => setIsSearchPopUp((prevState) => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="mb-2">
                            <label className="text-xs">ค้นหาโดย ชื่อวิชา(ภาษาไทย,อังกฤษ),ชื่อคุณครู</label>
                            <input 
                                name="search-bar" 
                                className="mt-1 w-full rounded-md border px-2 py-1  border-gray-200 shadow-sm sm:text-sm"
                                value={value} 
                                placeholder="ค้นหาวิชา...."
                                onChange={(e) => handleChange(e.target.value)}
                            />
                        </div>
                        <div className="list-subject">
                            <div className="overflow-x-auto h-80">
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3">
                                                    วิชา
                                                </th>
                                                <th className="px-6 py-3">
                                                    รหัสวิชา
                                                </th>
                                                <th className="px-6 py-3">
                                                    ประเภทวิชา
                                                </th>
                                                <th className="px-6 py-3">
                                                    ผู้สอน
                                                </th>
                                                <th className="px-6 py-3">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                            
                                        </thead>
                                        <tbody>
                                            {subjectList.map((sub) => (
                                                <tr key={sub.subId} className="bg-white border-b text-xs"> 
                                                    <td className="px-6 py-3">
                                                        {sub.subNameThai}({sub.subNameEng})
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {sub.subCode}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {sub.subjectType.subTypeNameThai}({sub.subjectType.subTypeId})
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        คุณครู {sub.teacher.fName} {sub.teacher.lName}
                                                    </td>
                                                    <td className="px-6 py-3" >
                                                        <span className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleSelectSubject(sub)}>เลือก</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {!subjectList.length > 0 && (
                                    <div className="mt-4">
                                        <span className="flex flex-col items-center justify-center gap-2 py-3 border rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                        </svg>
                                        ไม่พบผลการค้นหาหรือยังไม่เริ่มการค้นหา 
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                        
                    </div>
                    
                </div>
           }
        </div>
    );
};

export default Searchbar;
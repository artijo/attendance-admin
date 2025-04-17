import axios from "axios";
import { HOSTNAME } from "../../../config";
import { nameFormat } from "../../../helper";
import { useEffect, useState } from "react";

export const Searchpanel = ({ setSubjectActiveCard }) => {
    const [subjectList, setSubjectList] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [value, setValue] = useState("");

    const fetchSubjectList = async () => {
        try {
            // setIsLoading(true);
            // setError(null);
            const response = await axios.get(`${HOSTNAME}/a/subjects`);
            setSubjectList(response.data);
            setFilteredSubjects(response.data);
        } catch (error) {
            console.error(error);
            // setError("ไม่สามารถโหลดข้อมูลวิชาได้");
        } finally {
            // setIsLoading(false);
        }
    };
    const handleChange = (value) => {
        setValue(value);
        if (value.trim() === '') {
            setFilteredSubjects(subjectList);
            return;
        }

        const searchLower = value.toLowerCase();
        const results = subjectList.filter((subject) =>
            subject.teacher.fName.toLowerCase().includes(searchLower) ||
            subject.teacher.lName.toLowerCase().includes(searchLower) ||
            subject.subCode.toLowerCase().includes(searchLower) ||
            subject.subNameThai.toLowerCase().includes(searchLower) ||
            subject.subNameEng?.toLowerCase().includes(searchLower) ||
            nameFormat(subject.teacher.fName, subject.teacher.lName).toLowerCase().includes(searchLower)
        );

        setFilteredSubjects(results);
    };

    useEffect(() => {
        fetchSubjectList();
    }, [])

    return (
        <div className="max-w-[400px] border bg-white overflow-y-scroll overflow-x-hidden">
            <div>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-primary text-white">
                    <h3 className="text-lg font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        ค้นหาและเลือกรายวิชา
                    </h3>
                </div>
                <div className="p-4 border-b border-gray-200">
                    <label className="text-xs text-text-color-alt block mb-1">
                        ค้นหาโดย ชื่อวิชา, รหัสวิชา, ชื่อคุณครู
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            value={value}
                            placeholder="พิมพ์คำค้นหา..."
                            onChange={(e) => handleChange(e.target.value)}
                            autoFocus
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-2 ">
                    {filteredSubjects.map((subject) => (
                        <div
                            key={subject.subId} className="bg-white border rounded-xl p-5 transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-grab"
                            draggable
                            onDragStart={() => setSubjectActiveCard(subject)}
                            onDragEnd={() => setSubjectActiveCard(null)}
                        >
                            <h5 className="card-title text-text-color font-medium">{subject.subNameThai} <span className="text-text-color-alt ml-2 text-sm">({subject.subNameEng})</span></h5>
                            <div className="card-body mt-1 flex items-center gap-3 text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                                    {subject.subCode}
                                </span>
                                <span className="inline-flex items-center text-text-color-alt">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {subject.subjectType.subTypeNameThai}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-text-color-alt flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                คุณครู {subject.teacher.fName} {subject.teacher.lName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>


    );
};
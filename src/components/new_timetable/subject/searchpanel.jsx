import axios from "axios";
import { HOSTNAME } from "../../../config";
import { nameFormat } from "../../../helper";
import { useEffect, useState } from "react";
    
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


export const Searchpanel = ({ setSubjectActiveCard }) => {
    const [subjectList, setSubjectList] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [value, setValue] = useState("");

    const fetchSubjectList = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/a/subjects`);
            setSubjectList(response.data);
            setFilteredSubjects(response.data);
        } catch (error) {
            console.error("Failed to fetch subject list:", error);
        }
    };

    const handleChange = (event) => {
        const searchTerm = event.target.value;
        setValue(searchTerm);

        if (searchTerm.trim() === '') {
            setFilteredSubjects(subjectList);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
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
    }, []);

    return (
        <div className="relative flex flex-col h-[700px] max-w-[400px] bg-white rounded-lg shadow-lg border border-gray-200">
            
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <SearchIcon />
                    <span className="ml-2">ค้นหารายวิชา</span>
                </h3>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={value}
                        placeholder="ชื่อวิชา, รหัส, ชื่อผู้สอน..."
                        onChange={handleChange}
                        autoFocus
                    />
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-grow overflow-y-auto p-2 space-y-2">
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                        <div
                            key={subject.subId}
                            className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-150 ease-in-out hover:bg-gray-50 hover:border-blue-400 hover:cursor-grab active:cursor-grabbing"
                            draggable
                            onDragStart={() => setSubjectActiveCard(subject)}
                            onDragEnd={() => setSubjectActiveCard(null)}
                        >
                            {/* Card Header */}
                            <div>
                                <h5 className="font-semibold text-gray-800">{subject.subNameThai}</h5>
                                <p className="text-sm text-gray-500">{subject.subNameEng}</p>
                            </div>

                            {/* Card Footer with Details */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col space-y-1.5 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {subject.subCode}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <BuildingIcon />
                                    <span>{subject.subjectType.subTypeNameThai}</span>
                                </div>
                                <div className="flex items-center">
                                    <UserIcon />
                                    <span>คุณครู {nameFormat(subject.teacher.fName, subject.teacher.lName)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 px-4">
                        <p className="text-gray-500">ไม่พบรายวิชาที่ตรงกับคำค้นหา</p>
                    </div>
                )}
            </div>
        </div>
    );
};
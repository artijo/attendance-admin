import axios from "axios";
import { HOSTNAME } from "../../../config";
import { nameFormat } from "../../../helper";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

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
    const [isCardActive, setIsCardActive] = useState(-1);

    const getSubjectCardStyle = (subject) => {
        const hash = subject.subCode.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = hash % 360;
        const saturation = 75 + (hash % 20);
        const lightness = 40 + (hash % 10);

        return {
            borderLeft: `4px solid hsl(${hue}, ${saturation + 10}%, ${lightness - 10}%)`
        };
    };

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
        <div className="relative flex flex-col h-[730px] w-[1/4] bg-white rounded-lg shadow-lg border border-gray-200 z-0">
            
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

            <div className="flex-grow overflow-y-auto p-2 space-y-2">
                {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject,index) => (
                        <div 
                            className={`${isCardActive === index && "opacity-50"}  p-4 border border-gray-200 rounded-md  w-full flex flex-col items-start space-y-1 transition-all duration-150 ease-in-out hover:bg-gray-50 hover:shadow hover:border-transparent hover:cursor-grab active:cursor-grabbing`}
                            key={subject.subNameThai}
                            draggable
                            style={getSubjectCardStyle(subject)}
                            onDragStart={() => {
                                setSubjectActiveCard(subject)
                                setIsCardActive(index);
                            }}
                            onDragEnd={() => {
                                setSubjectActiveCard(null)
                                setIsCardActive(-1);
                            }}
                        >
                            <p className="text-sm font-medium text-gray-500">{subject.subCode}</p>
                            <h5 className="text-base font-bold text-gray-800">{subject.subNameThai}</h5>
                            <p className="text-sm font-medium text-gray-600 inline-flex items-center">
                                {subject.subNameEng}
                            </p>
                            <p className="text-sm font-medium text-gray-600 inline-flex items-center">
                                <BuildingIcon />
                                <span>{subject.subjectType.subTypeNameThai}</span>
                            </p>

                            <p className="text-sm font-medium text-gray-600 italic inline-flex items-center">
                                <UserIcon />
                                คุณครู {nameFormat(subject.teacher.fName, subject.teacher.lName)}
                            </p>
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
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { nameFormat } from "../../helper.js";
import PropTypes from 'prop-types';

function Searchbar({ valueSetSelectedSubject }) {
    const [subjectList, setSubjectList] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [value, setValue] = useState("");
    const [isSearchPopUp, setIsSearchPopUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const modalRef = useRef(null);

    const fetchSubjectList = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${HOSTNAME}/a/subjects`);
            setSubjectList(response.data);
            setFilteredSubjects(response.data);
        } catch (error) {
            console.error(error);
            setError("ไม่สามารถโหลดข้อมูลวิชาได้");
        } finally {
            setIsLoading(false);
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
    
    const handleSelectSubject = (subject) => {
        valueSetSelectedSubject(subject);
        setIsSearchPopUp(false);
    };
    
    const toggleSearchPopup = () => {
        if (!isSearchPopUp) {
            fetchSubjectList();
        }
        setIsSearchPopUp(!isSearchPopUp);
    };

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target) && !event.target.closest('.search-button')) {
                setIsSearchPopUp(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [modalRef]);
    
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isSearchPopUp) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSearchPopUp]);

    return (
        <div>
            <button
                type="button"
                className="search-button inline-flex items-center justify-center px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-300"
                onClick={toggleSearchPopup}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                เลือกวิชา
            </button>
            
            {isSearchPopUp && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div 
                        ref={modalRef}
                        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-primary text-white">
                            <h3 className="text-lg font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                ค้นหาและเลือกรายวิชา
                            </h3>
                            <button 
                                onClick={() => setIsSearchPopUp(false)}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-300 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
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
                        
                        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-text-color mb-2">{error}</h3>
                                    <p className="text-text-color-alt">โปรดลองอีกครั้งในภายหลัง</p>
                                </div>
                            ) : filteredSubjects.length === 0 ? (
                                <div className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-text-color mb-2">ไม่พบรายวิชาที่ค้นหา</h3>
                                    <p className="text-text-color-alt">ลองค้นหาด้วยคำอื่น</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredSubjects.map((subject) => (
                                        <div 
                                            key={subject.subId} 
                                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                            onClick={() => handleSelectSubject(subject)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-text-color font-medium">
                                                        {subject.subNameThai}
                                                        <span className="text-text-color-alt ml-2 text-sm">
                                                            ({subject.subNameEng || "-"})
                                                        </span>
                                                    </h4>
                                                    <div className="mt-1 flex items-center gap-3 text-sm">
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
                                                <button 
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectSubject(subject);
                                                    }}
                                                >
                                                    เลือกวิชานี้
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="text-sm text-text-color-alt">
                                จำนวนวิชาที่พบ: <span className="font-medium text-text-color">{filteredSubjects.length}</span>
                            </div>
                            
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-300"
                                onClick={() => setIsSearchPopUp(false)}
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Searchbar.propTypes = {
    valueSetSelectedSubject: PropTypes.func.isRequired
};

export default Searchbar;
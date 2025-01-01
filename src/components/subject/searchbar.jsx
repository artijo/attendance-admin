import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config";
import { nameFormat } from "../../helper.js"
// ...existing code...
import closeicon from '/public/ico/closeicon.svg';
// ...existing code...

export const Searchbar = ({ selectedSubject, inputvalue, setInputvalue}) => {
    const [subjectList, setSubjectList] = useState([]);
    const [input, setInput] = useState("");
    const [isShow, setIsShow] = useState(false);
    const [valueShow, setValueShow] = useState(false);
    const wrapperRef = useRef(null);


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
            setSubjectList(result);
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleChange = (value) => {
        setInputvalue(value);
        fetchSubjectList(value);    
    }


    const handleClickClose = () => {
        setInputvalue("");
        setSubjectList([]);
        selectedSubject({});
        setValueShow(!valueShow)
    }

    const handleClickResult = (value) => {
        setInputvalue(value.subCode);
        selectedSubject(value);
        setIsShow(false);
        setValueShow(!valueShow);
    };

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsShow(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full" ref={wrapperRef}>
            <label className="text-xs font-light">ค้นหาวิชา</label>
            <div>
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            value={inputvalue}
                            onChange={(e) => handleChange(e.target.value)}
                            onClick={() => setIsShow(true)}
                            placeholder="Search subjects..."
                            className="mt-1 px-2 py-1 w-full border rounded-md"
                        />
                        <div className={`${valueShow ? "block" : "hidden"} absolute top-0 right-0 bottom-0 flex items-center cursor-pointer pr-1`} onClick={() => handleClickClose()}>
                            <img src={closeicon} alt="close-icon" className="w-5 h-5" />
                        </div> 
                    </div>
                    
                    <div className={`w-full relative border rounded-lg shadow-lg mt-4 p-4 ${isShow ? "block" : "hidden"}`}>
                        <ul className="w-full overflow-y-auto max-h-40">
                            {subjectList.length > 0 ? (
                                subjectList.map((subject) => (
                                    <li key={subject.subId} className="p-2 border-b last:border-b-0 cursor-pointer" onClick={() => handleClickResult(subject)}>
                                        <span className="font-semibold text-gray-800">
                                            {subject.subCode} - {subject.subNameEng}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            ({subject.teacher.fName} {subject.teacher.lName})
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No Option</div>
                            )}
                        </ul>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
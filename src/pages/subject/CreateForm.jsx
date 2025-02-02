import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function CreateForm() {
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [subjectTypes, setSubjectTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const redirect = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        // Fetch subject types
        axios.get(`${HOSTNAME}/a/subjects/type`)
            .then(response => {
                setSubjectTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching subject types:", error);
            });

        // Fetch teachers and format for React-Select
        axios.get(`${HOSTNAME}/a/teachers`)
            .then(response => {
                const teacherOptions = response.data.map(teacher => ({
                    value: teacher.tchId,
                    label: `${teacher.tchCode} - ${teacher.fName} ${teacher.lName}`
                }));
                setTeachers(teacherOptions);
            })
            .catch(error => {
                console.error("Error fetching teachers:", error);
            });

            // Fetch subjects
        axios.get(`${HOSTNAME}/a/subjects`)
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.error("Error fetching subjects:", error);
            });
    }, []);

    const onSubmit = async function (data) {
        // Check if subject code already exists
        const existingSubject = subjects.find(subject => subject.subCode === data.subCode);
        if (existingSubject) {
            setError("รหัสวิชานี้มีอยู่ในระบบแล้ว");
            return;
        }

        try {
            const formData = {
                ...data,
                tchId: selectedTeacher?.value
            };
            const response = await axios.post(`${HOSTNAME}/a/subject`, formData);
            if (response.status === 200) {
                redirect("/subjects",
                    {state: {message: "เพิ่มวิชาเรียบร้อยแล้ว"}}
                );
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการสร้างวิชา");
        }
    }

    return (
        <div>
            <h1 className="font-bold text-center">เพิ่มวิชาใหม่</h1>
            <div className="mt-5">
                {error ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-500">{error}</p>
                    </div>
                ) : (
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="subCode" className="block text-xs font-medium text-gray-700">รหัสวิชา</label>
                                <input
                                    type="text"
                                    id="subCode"
                                    placeholder="MATH101"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("subCode", { required: true })}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="subCredit" className="block text-xs font-medium text-gray-700">หน่วยกิต</label>
                                <input
                                    type="number"
                                    id="subCredit"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("subCredit", { required: true })}
                                />
                            </div>

                            <div>
                                <label htmlFor="subNameThai" className="block text-xs font-medium text-gray-700">ชื่อวิชาภาษาไทย</label>
                                <input
                                    type="text"
                                    id="subNameThai"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("subNameThai", { required: true })}
                                />
                            </div>

                            <div>
                                <label htmlFor="subNameEng" className="block text-xs font-medium text-gray-700">ชื่อวิชาภาษาอังกฤษ</label>
                                <input
                                    type="text"
                                    id="subNameEng"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("subNameEng", { required: true })}
                                />
                            </div>

                            <div>
                                <label htmlFor="subTypeId" className="block text-xs font-medium text-gray-700">กลุ่มสาระการเรียนรู้</label>
                                <select
                                    id="subTypeId"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("subTypeId", { required: true })}
                                >
                                    {subjectTypes.map((type) => (
                                        <option key={type.subTypeId} value={type.subTypeId}>
                                            {type.subTypeNameThai}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tchId" className="block text-xs font-medium text-gray-700">ครูผู้สอน</label>
                                <Select
                                    id="tchId"
                                    options={teachers}
                                    value={selectedTeacher}
                                    onChange={setSelectedTeacher}
                                    placeholder="ค้นหาครูผู้สอน"
                                    isSearchable={true}
                                    noOptionsMessage={() => "ไม่พบข้อมูลครู"}
                                    className="mt-1"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                เพิ่มวิชา
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateForm;

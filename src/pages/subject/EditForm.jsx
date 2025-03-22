import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import Select from "react-select";

function EditForm() {
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [subjectTypes, setSubjectTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const redirect = useNavigate();
    const { id } = useParams();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        setIsLoading(true);
        
        Promise.all([
            axios.get(`${HOSTNAME}/a/subjects/type`),
            axios.get(`${HOSTNAME}/a/teachers`),
            axios.get(`${HOSTNAME}/a/subject/${id}`),
            axios.get(`${HOSTNAME}/a/subjects`)
        ])
        .then(([typesRes, teachersRes, subjectRes, subjectsRes]) => {
            setSubjectTypes(typesRes.data);
            
            // Format teachers for React-Select
            const teacherOptions = teachersRes.data.map(teacher => ({
                value: teacher.tchId,
                label: `${teacher.title === "MR" ? "นาย" : 
                        teacher.title === "MRS" ? "นาง" : "นางสาว"} ${teacher.fName} ${teacher.lName}`
            }));
            setTeachers(teacherOptions);
            
            // Set selected teacher
            const currentTeacher = teacherOptions.find(t => t.value === subjectRes.data.tchId);
            setSelectedTeacher(currentTeacher);

            // Pre-fill form with existing subject data
            reset({
                subCode: subjectRes.data.subCode,
                subNameThai: subjectRes.data.subNameThai,
                subNameEng: subjectRes.data.subNameEng,
                subCredit: subjectRes.data.subCredit,
                subTypeId: subjectRes.data.subTypeId,
            });

            setSubjects(subjectsRes.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setError("ไม่สามารถโหลดข้อมูลได้");
            setIsLoading(false);
        });
    }, [id, reset]);

    const onSubmit = async function (data) {
        const existingSubject = subjects.find(subject => subject.subCode === data.subCode && subject.subId !== parseInt(id));
        if (existingSubject) {
            setError("รหัสวิชานี้มีอยู่ในระบบแล้ว");
            return;
        }
        
        try {
            const formData = {
                ...data,
                tchId: selectedTeacher?.value
            };
            const response = await axios.put(`${HOSTNAME}/a/subject/${id}`, formData);
            if (response.status === 200) {
                redirect(`/subjects/${id}`, {
                    state: { message: "แก้ไขข้อมูลวิชาเรียบร้อยแล้ว" }
                });
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการแก้ไขข้อมูลวิชา");
        }
    };

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#e5e7eb',
            borderRadius: '0.5rem',
            minHeight: '42px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#d1d5db',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
        }),
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">แก้ไขข้อมูลวิชา</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
            <div className="mt-5">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                        <div className="flex justify-center mb-4 text-text-color-alt">
                            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">เกิดข้อผิดพลาด</h2>
                        <p className="text-text-color-alt font-body">{error}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="p-6">
                            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2">
                                    <label htmlFor="subCode" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        รหัสวิชา <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subCode"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("subCode", { required: true })}
                                    />
                                    {errors.subCode && <p className="text-red-500 text-xs mt-1 font-body">กรุณากรอกรหัสวิชา</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="subCredit" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        หน่วยกิต <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="subCredit"
                                        min="0"
                                        step="0.5"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("subCredit", { 
                                            required: true,
                                            min: 0
                                        })}
                                    />
                                    {errors.subCredit && <p className="text-red-500 text-xs mt-1 font-body">กรุณากรอกจำนวนหน่วยกิต</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subNameThai" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        ชื่อวิชาภาษาไทย <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subNameThai"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("subNameThai", { required: true })}
                                    />
                                    {errors.subNameThai && <p className="text-red-500 text-xs mt-1 font-body">กรุณากรอกชื่อวิชาภาษาไทย</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subNameEng" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        ชื่อวิชาภาษาอังกฤษ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subNameEng"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("subNameEng", { required: true })}
                                    />
                                    {errors.subNameEng && <p className="text-red-500 text-xs mt-1 font-body">กรุณากรอกชื่อวิชาภาษาอังกฤษ</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subTypeId" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        </svg>
                                        กลุ่มสาระการเรียนรู้ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="subTypeId"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("subTypeId", { required: true })}
                                    >
                                        {subjectTypes.map((type) => (
                                            <option key={type.subTypeId} value={type.subTypeId}>
                                                {type.subTypeNameThai}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subTypeId && <p className="text-red-500 text-xs mt-1 font-body">กรุณาเลือกกลุ่มสาระการเรียนรู้</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="tchId" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        ครูผู้สอน
                                    </label>
                                    <Select
                                        id="tchId"
                                        options={teachers}
                                        value={selectedTeacher}
                                        onChange={setSelectedTeacher}
                                        placeholder="ค้นหาครูผู้สอน"
                                        isSearchable={true}
                                        noOptionsMessage={() => "ไม่พบข้อมูลครู"}
                                        styles={customSelectStyles}
                                        className="font-body text-text-color"
                                    />
                                </div>

                                <div className="sm:col-span-2 flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                                    <Link 
                                        to={`/subjects/${id}`}
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        ยกเลิก
                                    </Link>
                                    
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        บันทึกการแก้ไข
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditForm;

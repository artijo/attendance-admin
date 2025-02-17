import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams } from "react-router-dom";
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
                label: `${teacher.fName} ${teacher.lName}`
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
        const existingSubject = subjects.find(subject => subject.subCode === data.subCode);
        if (existingSubject && existingSubject.subId !== id) {
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
                redirect("/subjects", {
                    state: { message: "แก้ไขข้อมูลวิชาเรียบร้อยแล้ว" }
                });
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการแก้ไขข้อมูลวิชา");
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-bold text-center">แก้ไขข้อมูลวิชา</h1>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                บันทึก
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditForm;

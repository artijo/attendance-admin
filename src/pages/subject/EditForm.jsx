import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams } from "react-router-dom";

function EditForm() {
    const [error, setError] = useState(null);
    const [subjectTypes, setSubjectTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
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
            axios.get(`${HOSTNAME}/a/subject/${id}`)
        ])
        .then(([typesRes, teachersRes, subjectRes]) => {
            setSubjectTypes(typesRes.data);
            setTeachers(teachersRes.data);
            // Pre-fill form with existing subject data
            reset({
                subCode: subjectRes.data.subCode,
                subNameThai: subjectRes.data.subNameThai,
                subNameEng: subjectRes.data.subNameEng,
                subCredit: subjectRes.data.subCredit,
                subTypeId: subjectRes.data.subTypeId,
                tchId: subjectRes.data.tchId
            });
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setError("ไม่สามารถโหลดข้อมูลได้");
            setIsLoading(false);
        });
    }, [id, reset]);

    const onSubmit = async function (data) {
        try {
            const response = await axios.put(`${HOSTNAME}/a/subject/${id}`, data);
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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>แก้ไขข้อมูลวิชา</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {error && <div className="text-red-500">{error}</div>}
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
                        <select
                            id="tchId"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("tchId", { required: true })}
                        >
                            {teachers.map((teacher) => (
                                <option key={teacher.tchId} value={teacher.tchId}>
                                    {teacher.fName} {teacher.lName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        type="submit"
                        className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    >
                        บันทึก
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditForm;

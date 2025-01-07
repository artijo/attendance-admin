import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";

function CreateForm() {
    const [error, setError] = useState(null);
    const [subjectTypes, setSubjectTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
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

        // Fetch teachers
        axios.get(`${HOSTNAME}/a/teachers`)
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error("Error fetching teachers:", error);
            });
    }, []);

    const onSubmit = async function (data) {
        try {
            const response = await axios.post(`${HOSTNAME}/a/subject`, data);
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
            <h1>ฟอร์มเพิ่มวิชาใหม่</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {error && <div className="text-red-500">{error}</div>}
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
                        เพิ่มวิชา
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateForm;

import { useForm } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";

function CreateForm() {
    const [errors, setErrors] = useState({});
    const redirect = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { formErrors },
    } = useForm();

    const onSubmit = async function (data) {
        try {
            const response = await axios.post(`${HOSTNAME}/a/student`, data);
            if (response.status === 200) {
                redirect("/students",
                    {state: {message: "เพิ่มนักเรียนเรียบร้อยแล้ว"}}
                );
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const serverErrors = error.response.data;
                const errorMessages = {
                    stdId: serverErrors.stdId === "duplicate" ? "รหัสนักเรียนนี้มีอยู่ในระบบแล้ว" : "",
                    email: serverErrors.email === "duplicate" ? "อีเมลนี้มีอยู่ในระบบแล้ว" : "",
                    tel: serverErrors.tel === "duplicate" ? "เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว" : "",
                };
                setErrors(errorMessages);
            } else {
                setErrors({ general: "เกิดข้อผิดพลาดในการสร้างนักเรียน" });
            }
        }
    }

    return (
        <div>
            <h1 className="font-bold text-center">เพิ่มนักเรียนใหม่</h1>
            <div className="mt-5">
                {errors.general ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-500">{errors.general}</p>
                    </div>
                ) : (
                    <div className=" border bg-white shadow rounded-2xl  p-6">
                        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                            {/* Student ID field */}
                            <div>
                                <label htmlFor="StudentId" className="block text-sm font-medium text-gray-700">
                                    รหัสนักเรียน
                                </label>
                                <input
                                    type="text"
                                    id="StudentId"
                                    placeholder="xxxxxx"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("stdId")}
                                />
                                {errors.stdId && <p className="text-red-500 text-xs mt-1">{errors.stdId}</p>}
                            </div>

                            {/* Title field */}
                            <div>
                                <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
                                    คำนำหน้า
                                </label>
                                <select
                                    id="Title"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("title")}
                                >
                                    <option value="BOY">เด็กชาย</option>
                                    <option value="GIRL">เด็กหญิง</option>
                                    <option value="MR">นาย</option>
                                    <option value="MRS">นางสาว</option>
                                </select>
                            </div>

                            {/* Firstname field */}
                            <div>
                                <label htmlFor="Firstname" className="block text-sm font-medium text-gray-700"> ชื่อ</label>
                                
                                <input
                                    type="text"
                                    id="Firstname"
                                    placeholder="ชื่อ"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("fName")}
                                />
                            </div>

                            {/* Lastname field */}
                            <div>
                                <label htmlFor="Lastname" className="block text-sm font-medium text-gray-700"> นามสกุล</label>
                                
                                <input
                                    type="text"
                                    id="Lastname"
                                    placeholder="นามสกุล"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("lName")}
                                />
                            </div>

                            {/* Email field with error handling */}
                            <div>
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                                    อีเมล
                                </label>
                                <input
                                    type="text"
                                    id="Email"
                                    placeholder="user@nps.ac.th"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Tel field with error handling */}
                            <div>
                                <label htmlFor="Tel" className="block text-sm font-medium text-gray-700">
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    type="text"
                                    id="Tel"
                                    placeholder="000-000-0000"
                                    className="mt-1 w-full h-8 rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                    {...register("tel")}
                                />
                                {errors.tel && <p className="text-red-500 text-xs mt-1">{errors.tel}</p>}
                            </div>

                            {/* Submit button */}
                            <div className="sm:col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    เพิ่มนักเรียน
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateForm;
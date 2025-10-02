import { useForm } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { validatePhoneNumber, validateStudent } from "../../regx.js";
import ErrorAlert from "../../components/alert/error.jsx";

function CreateForm() {
    const [errors, setErrors] = useState({});
    const [inputError, setInputError] = useState({});

    const redirect = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { formErrors },
    } = useForm();

    const inputValidation = (data) => {
        /* data structure
        {  
            "stdId": "Number XXXXXX",
            "title": "BOY",
            "fName": "John",
            "lName": "Wood",
            "email": "email@email.com",
            "tel": "XXXXXXXX"
        }
        */
        // stdId validate
        if (!validateStudent(data.stdId)) {
            setInputError({
                title: "เกิดข้อผิดพลาด",
                description: "กรอกรหัสนักศึกษาไม่ถูกต้องตามรูปแบบโดยรูปแบบจะต้องเป็นเลข 0-9 ได้แค่ 5 ตัวเลขเท่านั้น"
            });
            return false;
        };

        //tel validate
        if (!validatePhoneNumber(data.tel)) {
            if (data.tel === "" || data.tel === " ") {
                return true;
            } else {
                setInputError({
                    title: "เกิดข้อผิดพลาด",
                    description: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"
                })
                return false;
            };
        };

        return true;
    };


    const onSubmit = async function (data) {
        // console.log(data);
        const validateInputStatus = inputValidation(data); // Call inputValidation function.
        if (!validateInputStatus) return; //if format not good for any input return; for stop this function.

        try {
            const response = await axios.post(`${HOSTNAME}/a/student`, data);
            if (response.status === 200) {
                redirect("/students",
                    { state: { message: "เพิ่มนักเรียนเรียบร้อยแล้ว" } }
                );
            }
        } catch (error) {
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
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มนักเรียนใหม่</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            <div className="mt-5">
                {inputError.title && inputError.description && (
                    // Onclick = {() => setInputError({})} mean dismiss alert.  
                    <div className="mb-2" onClick={() => setInputError({})}>
                        <ErrorAlert title={inputError.title} message={inputError.description} />
                    </div>

                )}


                {errors.general ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
                        <div className="flex justify-center mb-4 text-text-color-alt">
                            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">เกิดข้อผิดพลาด</h2>
                        <p className="text-text-color-alt font-body">{errors.general}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="p-6">
                            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                                {/* Student ID field */}
                                <div className="space-y-2">
                                    <label htmlFor="StudentId" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        รหัสนักเรียน <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="StudentId"
                                        placeholder="xxxxxx"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("stdId", { required: true })}
                                        required
                                    />
                                    {errors.stdId && <p className="text-red-500 text-xs mt-1 font-body">{errors.stdId}</p>}
                                </div>

                                {/* Title field */}
                                <div className="space-y-2">
                                    <label htmlFor="Title" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        คำนำหน้า <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="Title"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("title", { required: true })}
                                        required
                                    >
                                        <option value="BOY">เด็กชาย</option>
                                        <option value="GIRL">เด็กหญิง</option>
                                        <option value="MR">นาย</option>
                                        <option value="MS">นางสาว</option>
                                    </select>
                                </div>

                                {/* Firstname field */}
                                <div className="space-y-2">
                                    <label htmlFor="Firstname" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ชื่อ <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="Firstname"
                                        placeholder="ชื่อ"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("fName", { required: true })}
                                        required
                                    />
                                </div>

                                {/* Lastname field */}
                                <div className="space-y-2">
                                    <label htmlFor="Lastname" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        นามสกุล <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="Lastname"
                                        placeholder="นามสกุล"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("lName", { required: true })}
                                        required
                                    />
                                </div>

                                {/* Email field with error handling */}
                                <div className="space-y-2">
                                    <label htmlFor="Email" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        อีเมล
                                    </label>
                                    <input
                                        type="email"
                                        id="Email"
                                        placeholder="user@nps.ac.th"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("email")}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>}
                                </div>

                                {/* Tel field with error handling */}
                                <div className="space-y-2">
                                    <label htmlFor="Tel" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        เบอร์โทรศัพท์
                                    </label>
                                    <input
                                        type="text"
                                        id="Tel"
                                        placeholder="000-000-0000"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("tel")}
                                    />
                                    {errors.tel && <p className="text-red-500 text-xs mt-1 font-body">{errors.tel}</p>}
                                </div>

                                {/* Submit button */}
                                <div className="sm:col-span-2 flex justify-between items-center pt-4">
                                    <Link
                                        to="/students"
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
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        เพิ่มนักเรียน
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

export default CreateForm;
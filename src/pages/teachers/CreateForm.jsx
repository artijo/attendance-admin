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
        watch,
        formState: { errors: formErrors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async function (data) {
        const { confirmPassword, ...submitData } = data;
        try {
            const response = await axios.post(`${HOSTNAME}/a/teacher`, submitData);
            if (response.status === 200) {
                redirect("/teachers",
                    {state: {message: "เพิ่มครูเรียบร้อยแล้ว"}}
                );
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const serverErrors = error.response.data;
                const errorMessages = {
                    tchCode: serverErrors.tchCode === "duplicate" ? "รหัสครูนี้มีอยู่ในระบบแล้ว" : "",
                    email: serverErrors.email === "duplicate" ? "อีเมลนี้มีอยู่ในระบบแล้ว" : "",
                    tel: serverErrors.tel === "duplicate" ? "เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว" : "",
                };
                setErrors(errorMessages);
            } else {
                setErrors({ general: "เกิดข้อผิดพลาดในการเพิ่มครู" });
            }
        }
    }

    return (
        <div>
            <h1 className="font-bold text-center">เพิ่มคุณครู</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="TeacherCode" className="block text-xs font-medium text-gray-700">รหัสครู</label>
                        <input
                            type="text"
                            id="TeacherCode"
                            placeholder="TCHxxxx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("tchCode")}
                        />
                        {errors.tchCode && <p className="text-red-500 text-xs mt-1">{errors.tchCode}</p>}
                    </div>

                    <div>
                        <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700">ชื่อ</label>
                        <input
                            type="text"
                            id="Firstname"
                            placeholder="ชื่อ"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("fName")}
                        />
                    </div>

                    <div>
                        <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">นามสกุล</label>
                        <input
                            type="text"
                            id="Lastname"
                            placeholder="นามสกุล"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("lName")}
                        />
                    </div>

                    <div>
                        <label htmlFor="Email" className="block text-xs font-medium text-gray-700">อีเมล</label>
                        <input
                            type="email"
                            id="Email"
                            placeholder="example@nps.ac.th"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="Tel" className="block text-xs font-medium text-gray-700">เบอร์โทรศัพท์</label>
                        <input
                            type="tel"
                            id="Tel"
                            placeholder="0xx-xxx-xxxx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("tel")}
                        />
                        {errors.tel && <p className="text-red-500 text-xs mt-1">{errors.tel}</p>}
                    </div>

                    <div>
                        <label htmlFor="Password" className="block text-xs font-medium text-gray-700">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="Password"
                            placeholder="••••••••"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("password", {
                                required: "กรุณากรอกรหัสผ่าน",
                                minLength: {
                                    value: 8,
                                    message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
                                }
                            })}
                        />
                        {formErrors.password && (
                            <span className="text-red-500 text-xs">{formErrors.password.message}</span>
                        )}
                    </div>

                    <div>
                        <label htmlFor="ConfirmPassword" className="block text-xs font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            id="ConfirmPassword"
                            placeholder="••••••••"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("confirmPassword", {
                                required: "กรุณายืนยันรหัสผ่าน",
                                validate: value => 
                                    value === password || "รหัสผ่านไม่ตรงกัน"
                            })}
                        />
                        {formErrors.confirmPassword && (
                            <span className="text-red-500 text-xs">{formErrors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        เพิ่มครู
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateForm;

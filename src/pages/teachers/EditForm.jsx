import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams } from "react-router-dom";

function EditForm() {
    const [errors, setErrors] = useState({});
    const redirect = useNavigate();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors: formErrors },
    } = useForm();

    const password = watch("password");

    useEffect(() => {
        // Fetch teacher data when component mounts
        const fetchTeacher = async () => {
            try {
                const response = await axios.get(`${HOSTNAME}/a/teacher/${id}`);
                const teacherData = response.data;
                
                // Set form values
                setValue("tchCode", teacherData.tchCode);
                setValue("fName", teacherData.fName);
                setValue("lName", teacherData.lName);
                setValue("email", teacherData.email);
                setValue("tel", teacherData.tel);
            } catch (error) {
                console.error(error);
                setErrors("ไม่สามารถดึงข้อมูลครูได้");
            }
        };

        fetchTeacher();
    }, [id, setValue]);

    const onSubmit = async function (data) {
        // Remove confirm password and empty password fields before submitting
        const { confirmPassword, password, ...submitData } = data;
        if (password) {
            submitData.password = password;
        }

        try {
            const response = await axios.put(`${HOSTNAME}/a/teacher/${id}`, submitData);
            if (response.status === 200) {
                redirect("/teachers",
                    {state: {message: "แก้ไขข้อมูลครูเรียบร้อยแล้ว"}}
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
                setErrors({ general: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลครู" });
            }
        }
    };

    // if (!teacher) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div>
            <h1 className="font-bold text-center">แก้ไขข้อมูลคุณครู</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="TeacherCode" className="block text-xs font-medium text-gray-700">รหัสครู</label>
                        <input
                            type="text"
                            id="TeacherCode"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm bg-gray-100"
                            {...register("tchCode")}
                            readOnly
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
                        <label htmlFor="Password" className="block text-xs font-medium text-gray-700">รหัสผ่านใหม่ (ไม่ต้องกรอกถ้าไม่ต้องการเปลี่ยน)</label>
                        <input
                            type="password"
                            id="Password"
                            placeholder="••••••••"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("password", {
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
                        <label htmlFor="ConfirmPassword" className="block text-xs font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            id="ConfirmPassword"
                            placeholder="••••••••"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("confirmPassword", {
                                validate: value => 
                                    !password || value === password || "รหัสผ่านไม่ตรงกัน"
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
                        บันทึกการแก้ไข
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditForm;

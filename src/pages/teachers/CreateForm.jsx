import { useForm } from "react-hook-form"
import { useState } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";

function CreateForm() {
    const [error, setError] = useState(null);
    const redirect = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
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
            setError("เกิดข้อผิดพลาดในการเพิ่มครู");
        }
    }

    return (
        <div>
            <h1>ฟอร์มเพิ่มครูใหม่</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {error && <div className="text-red-500">{error}</div>}
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
                        {errors.password && (
                            <span className="text-red-500 text-xs">{errors.password.message}</span>
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
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        เพิ่มครู
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateForm;

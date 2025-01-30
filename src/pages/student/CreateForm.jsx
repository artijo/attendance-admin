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
            <h1 className="font-bold text-center">ฟอร์มเพิ่มนักเรียนใหม่</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="StudentId" className="block text-xs font-medium text-gray-700">รหัสนักเรียน</label>
                        <input
                            type="text"
                            id="StudentId"
                            placeholder="xxxxxx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("stdId")}
                        />
                        {errors.stdId && <p className="text-red-500 text-xs mt-1">{errors.stdId}</p>}
                    </div>
                    <div>
                        <label htmlFor="Title" className="block text-xs font-medium text-gray-700"> คำนำหน้า</label>
                        
                        <select
                            id="Title"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("title")}
                        >
                            <option value={"BOY"}>เด็กชาย</option>
                            <option value={"GIRL"}>เด็กหญิง</option>
                            <option value={"MR"}>นาย</option>
                            <option value={"MRS"}>นางสาว</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="Firstname" className="block text-xs font-medium text-gray-700"> ชื่อ</label>
                        
                        <input
                            type="text"
                            id="Firstname"
                            placeholder="ชื่อ"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("fName")}
                        />
                    </div>
                    <div>
                        <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700"> นามสกุล</label>
                        
                        <input
                            type="text"
                            id="Lastname"
                            placeholder="นามสกุล"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("lName")}
                        />
                    </div>
                    <div>
                        <label htmlFor="Email" className="block text-xs font-medium text-gray-700"> อีเมล</label>
                        <input
                            type="text"
                            id="Email"
                            placeholder="user@nps.ac.th"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="Tel" className="block text-xs font-medium text-gray-700"> เบอร์โทรศัพท์</label>
                        <input
                            type="text"
                            id="Tel"
                            placeholder="000-000-0000"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("tel")}
                        />
                        {errors.tel && <p className="text-red-500 text-xs mt-1">{errors.tel}</p>}
                    </div>
                    <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        เพิ่มนักเรียน
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateForm;
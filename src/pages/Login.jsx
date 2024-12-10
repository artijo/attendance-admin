import { useForm } from "react-hook-form"
import { HOSTNAME } from "../config.js";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth.js";

function Login() {
  const [error, setError] = useState(null);
  const { user, login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit =async function (data) {
    try {
      // const response = await axios.post(`${HOSTNAME}/a/auth/login`, data);
      // if (response.status === 200) {

      //   localStorage.setItem("refreshToken", response.data.refreshToken);
      const res = await login(data.username, data.password);
      console.log(res);
      if (res.status === 200) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
      setError("Username หรือ Password ไม่ถูกต้อง");
    }
  }

  return (
    <div className="w-full h-[96dvh] flex flex-col gap-2 justify-center items-center">
      <div className="shadow-lg p-10 md:p-20 rounded-md">

      <h1 className="text-center text-2xl md:text-3xl">เข้าสู่ระบบ • สำหรับผู้ดูแล</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      <div className="mt-5 space-y-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          {" "}
          Username{" "}
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          placeholder="username@user"
          className="mt-1 w-full h-10 rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          {" "}
          Password{" "}
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="mt-1 w-full h-10 rounded-md border-gray-200 shadow-sm sm:text-sm"
        />
        <button type="submit" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">เข้าสู่ระบบ</button>
      </div>
      </form>
      </div>
    </div>
  );
}
export default Login;

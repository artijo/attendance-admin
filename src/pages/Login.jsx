import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../Hooks/useAuth.js";
import { validateLogin } from "../validator.js";

function Login() {
  const [error, setError] = useState(null);
  const { user, login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async function (data) {
    try {
      // const response = await axios.post(`${HOSTNAME}/a/auth/login`, data);
      // if (response.status === 200) {

      //   localStorage.setItem("refreshToken", response.data.refreshToken);
      const { value, errors } = validateLogin(data.username, data.password);
      if (errors) {
        setError(errors.username || errors.password);
        return;
      }
      const res = await login(value.username, value.password);
      console.log(res);
      if (res.status === 200) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
      setError("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="w-full h-[96dvh] flex flex-col gap-2 justify-center items-center bg-background">
      <div className="shadow-xl p-10 md:p-16 rounded-xl bg-white border border-line-alt max-w-md w-full transition-all duration-300 hover:shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-primary font-heading">
            เข้าสู่ระบบ • สำหรับผู้ดูแล
          </h1>
          <div className="mt-2 h-1 w-16 bg-secondary mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6 space-y-5 font-body">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-color"
              >
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-text-color-alt"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  placeholder="username@user"
                  className="pl-10 mt-1 block w-full h-12 rounded-lg border-line bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-color"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-text-color-alt"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="pl-10 mt-1 block w-full h-12 rounded-lg border-line bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full py-3 px-5 text-sm font-medium text-white bg-primary hover:bg-accent rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                เข้าสู่ระบบ
              </button>

              {/* <div className="text-center">
                <span className="text-text-color-alt text-sm">ยังไม่มีบัญชี? </span>
                <a href="#" className="text-secondary hover:underline text-sm">ติดต่อผู้ดูแลระบบ</a>
              </div> */}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-4 text-text-color-alt text-sm font-body">
        © {new Date().getFullYear()}{" "}
        ระบบบันทึกและติดตามการเข้าเรียนและกิจกรรมของนักเรียน
      </div>
    </div>
  );
}
export default Login;

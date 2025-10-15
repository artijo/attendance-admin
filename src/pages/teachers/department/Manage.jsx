import React, { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../../config.js";
import { Link } from "react-router-dom";
import AlertSuccess from "../../../components/alert/success.jsx";
import ErrorAlert from "../../../components/alert/error.jsx";
import { validateDepartment } from "../../../validator.js";

const DepartmentManage = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [formData, setFormData] = useState({ deptName: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [successful, setSuccessful] = useState({
    title: "",
    description: "",
  });

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${HOSTNAME}/a/departments`);
      setDepartments(response.data);
      setError("");
    } catch (error) {
      setError("ไม่สามารถดึงข้อมูลสังกัดกลุ่มสาระการเรียนรู้ของครูได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate using Yup
    const validation = validateDepartment(formData);

    if (!validation.success) {
      setValidationErrors(validation.errors);
      return;
    }

    // Clear validation errors
    setValidationErrors({});

    try {
      if (editingId) {
        await axios.put(
          `${HOSTNAME}/a/department/${editingId}`,
          validation.value
        );
      } else {
        await axios.post(`${HOSTNAME}/a/department`, validation.value);
      }
      setSuccessful({
        title: `${editingId ? "แก้ไข" : "เพิ่ม"}สำเร็จ`,
        description: `${editingId ? "แก้ไข" : "เพิ่ม"}สังกัดกลุ่มสาระสำเร็จ`,
      });
      setIsModalOpen(false);
      setFormData({ deptName: "" });
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        if (serverError.deptName === "duplicate") {
          setValidationErrors({ deptName: "ชื่อกลุ่มสาระนี้มีอยู่ในระบบแล้ว" });
        } else {
          setError("เกิดข้อผิดพลาดในการดำเนินการ");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการดำเนินการ");
      }
    }
  };

  const handleEdit = (department) => {
    setFormData(department);
    setEditingId(department.deptId);
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      await axios.delete(
        `${HOSTNAME}/a/department/${departmentToDelete.deptId}`
      );
      await fetchDepartments();
    } catch (error) {
      setError("Delete failed");
      return;
    } finally {
      setSuccessful({
        title: "ลบสำเร็จ",
        description: "ลบกลุ่มสาระนั้นสำเร็จ",
      });
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          จัดการสังกัดกลุ่มสาระของคุณครู
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {departments.length > 0 && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">
              จำนวนกลุ่มสาระทั้งหมด:
            </span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">
              {departments.length} กลุ่ม
            </span>
          </div>
        )}

        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({ deptName: "" });
            setEditingId(null);
          }}
          className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          เพิ่มสังกัดกลุ่มสาระ
        </button>
      </div>

      {successful.title && successful.description && (
        <div
          className="mb-6"
          onClick={() => setSuccessful({ title: "", description: "" })}
        >
          <AlertSuccess
            title={successful.title}
            message={successful.description}
          />
        </div>
      )}

      {error && (
        <div className="mb-6" onClick={() => setError("")}>
          <ErrorAlert title="เกิดข้อผิดพลาด" message={error} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">
            ไม่พบข้อมูลกลุ่มสาระ
          </h2>
          <p className="text-text-color-alt font-body">
            กรุณาเพิ่มข้อมูลกลุ่มสาระการเรียนรู้
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
                <tr>
                  <th className="px-6 py-4">ชื่อกลุ่มสาระ</th>
                  <th className="px-6 py-4 text-center" width="180">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departments.map((dept) => (
                  <tr
                    key={dept.deptId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-text-color">
                      {dept.deptName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex overflow-hidden rounded-md border border-line bg-white shadow-sm">
                        <button
                          className="inline-block p-2.5 text-primary hover:bg-gray-50 focus:relative"
                          onClick={() => handleEdit(dept)}
                          title="แก้ไขข้อมูล"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          className="inline-block p-2.5 text-red-600 hover:bg-gray-50 focus:relative"
                          onClick={() => handleDelete(dept)}
                          title="ลบข้อมูล"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer action button */}
      <div className="mt-6 flex justify-end">
        <Link
          to="/teachers"
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          กลับไปหน้ารายการครู
        </Link>
      </div>

      {/* Modals */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-color font-heading mb-2">
                ยืนยันการลบ
              </h3>
              <p className="text-text-color-alt font-body">
                คุณต้องการลบสังกัดกลุ่มสาระ "{departmentToDelete?.deptName}"
                ใช่หรือไม่?
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDepartmentToDelete(null);
                }}
                className="px-4 py-2.5 text-sm font-medium text-text-color bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-text-color font-heading mb-2">
                {editingId ? "แก้ไขสังกัดกลุ่มสาระ" : "เพิ่มสังกัดกลุ่มสาระ"}
              </h3>
              <div className="h-1 w-10 bg-secondary rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-color font-body mb-2">
                  ชื่อกลุ่มสาระ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deptName}
                  onChange={(e) => {
                    setFormData({ ...formData, deptName: e.target.value });
                    // Clear error when user types
                    if (validationErrors.deptName) {
                      setValidationErrors({
                        ...validationErrors,
                        deptName: "",
                      });
                    }
                  }}
                  className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                    validationErrors.deptName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="ระบุชื่อกลุ่มสาระการเรียนรู้"
                />
                {validationErrors.deptName && (
                  <p className="text-red-500 text-xs mt-1 font-body">
                    {validationErrors.deptName}
                  </p>
                )}
                <p className="text-xs text-text-color-alt mt-1 font-body">
                  ตัวอย่าง: กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
                </p>
              </div>

              <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setValidationErrors({});
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-text-color bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                  {editingId ? (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      บันทึก
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      เพิ่ม
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";

const DepartmentManage = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [formData, setFormData] = useState({ deptName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${HOSTNAME}/a/departments`);
      setDepartments(response.data);
    } catch (error) {
      setError('ไม่สามารถดึงข้อมูลสังกัดกลุ่มสาระการเรียนรู้ของครูได้');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        console.log(editingId);
        await axios.put(`${HOSTNAME}/a/department/${editingId}`, formData);
      } else {
        await axios.post(`${HOSTNAME}/a/department`, formData);
      }
      setIsModalOpen(false);
      setFormData({  deptName: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการดำเนินการ');
    }
  };

  const handleEdit = (department) => {
    setFormData(department);
    setEditingId(department.deptId);
    setIsModalOpen(true);
  };

  const handleDelete = async (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    
    try {
      await axios.delete(`${HOSTNAME}/a/department/${departmentToDelete.deptId}`);
      await fetchDepartments();
    } catch (error) {
      setError('Delete failed');
      return;
    } finally {
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-center">จัดการสังกัดกลุ่มสาระของคุณครู</h1>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({ deptName: '' });
            setEditingId(null);
          }}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          เพิ่มสังกัดกลุ่มสาระ
        </button>
      </div>
      <div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสสังกัดกลุ่มสาระ</th> */}
                  <th className="px-6 py-3">ชื่อกลุ่มสาระ</th>
                  <th className="px-6 py-3">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.deptId} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                    {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">{dept.deptCode}</td> */}
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{dept.deptName}</td>
                    <td>
                      <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                        <button
                          className="inline-block p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                          onClick={() => handleEdit(dept)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          className="inline-block p-3 text-red-600 hover:bg-gray-50 focus:relative"
                          onClick={() => handleDelete(dept)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
              <p className="mb-4">
                คุณต้องการลบสังกัดกลุ่มสาระ "{departmentToDelete?.deptName}" ใช่หรือไม่?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDepartmentToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  ยืนยันการลบ
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'แก้ไขสังกัดกลุ่มสาระ' : 'เพิ่มสังกัดกลุ่มสาระ'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                {/* <div>
                  <label className="block text-xs font-medium text-gray-700">
                    รหัสสังกัดกลุ่มสาระ
                  </label>
                  <input
                    type="text"
                    value={formData.deptCode}
                    onChange={(e) => setFormData({ ...formData, deptCode: e.target.value })}
                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                    maxLength={10}
                  />
                </div> */}
                
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    ชื่อกลุ่มสาระ
                  </label>
                  <input
                    type="text"
                    value={formData.deptName}
                    onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 "
                  >
                    {editingId ? 'บันทึก' : 'เพิ่ม'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManage;

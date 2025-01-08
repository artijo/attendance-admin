import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";

const DepartmentManage = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [formData, setFormData] = useState({ deptCode: '', deptName: '' });
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
      setFormData({ deptCode: '', deptName: '' });
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
      <h1>จัดการสังกัดกลุ่มสาระของคุณครู</h1>
      <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({ deptCode: '', deptName: '' });
            setEditingId(null);
          }}
          className="mb-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          เพิ่มสังกัดกลุ่มสาระ
        </button>

        <div className="rounded-lg border border-gray-200">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสสังกัดกลุ่มสาระ</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อกลุ่มสาระ</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.deptId}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{dept.deptCode}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{dept.deptName}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="mr-2 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(dept)}
                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        ลบ
                      </button>
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
                <div>
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
                </div>
                
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
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
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

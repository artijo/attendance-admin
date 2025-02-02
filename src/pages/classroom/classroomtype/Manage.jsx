import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";

const ClassroomTypeManage = () => {
  const [classroomTypes, setClassroomTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classroomTypeToDelete, setClassroomTypeToDelete] = useState(null);
  const [formData, setFormData] = useState({ classTypeNameThai: '', classTypeNameEng: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchClassroomTypes = async () => {
    try {
      const response = await axios.get(`${HOSTNAME}/a/classrooms/types`);
      setClassroomTypes(response.data);
    } catch (error) {
      setError('ไม่สามารถดึงข้อมูลประเภทห้องเรียนได้');
    }
  };

  useEffect(() => {
    fetchClassroomTypes();
  }, []);

  const isProtectedType = (type) => {
    return type.classTypeNameEng === 'Unspecified' || type.classTypeNameThai === 'ไม่ระบุ';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${HOSTNAME}/a/classroom/type/${editingId}`, formData);
      } else {
        await axios.post(`${HOSTNAME}/a/classroom/type`, formData);
      }
      setIsModalOpen(false);
      setFormData({ classTypeNameThai: '', classTypeNameEng: '' });
      setEditingId(null);
      fetchClassroomTypes();
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการดำเนินการ');
    }
  };

  const handleEdit = (classroomType) => {
    if (isProtectedType(classroomType)) {
      setError('ไม่สามารถแก้ไขประเภทห้องเรียนที่เป็นค่าเริ่มต้นระบบได้');
      return;
    }
    setFormData(classroomType);
    setEditingId(classroomType.classTypeId);
    setIsModalOpen(true);
  };

  const handleDelete = (classroomType) => {
    if (isProtectedType(classroomType)) {
      setError('ไม่สามารถลบประเภทห้องเรียนที่เป็นค่าเริ่มต้นระบบได้');
      return;
    }
    setClassroomTypeToDelete(classroomType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!classroomTypeToDelete) return;
    
    try {
      await axios.delete(`${HOSTNAME}/a/classroom/type/${classroomTypeToDelete.classTypeId}`);
      await fetchClassroomTypes();
    } catch (error) {
      setError('ลบไม่สำเร็จ');
      return;
    } finally {
      setIsDeleteModalOpen(false);
      setClassroomTypeToDelete(null);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-center">จัดการประเภทห้องเรียน</h1>
      <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData({ classTypeNameThai: '', classTypeNameEng: '' });
              setEditingId(null);
            }}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มประเภทห้องเรียน
          </button>
        </div>

        <div className="rounded-lg border border-gray-200">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทห้องเรียน (ไทย)</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทห้องเรียน (อังกฤษ)</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classroomTypes.map((type) => (
                  <tr key={type.classTypeId}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.classTypeNameThai}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.classTypeNameEng}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                        onClick={() => handleEdit(type)}
                        disabled={isProtectedType(type)}
                        className="inline-flex justify-center items-center px-4 py-2 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(type)}
                        disabled={isProtectedType(type)}
                        className={`text-white ${
                          isProtectedType(type)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300'
                        } font-medium rounded-lg text-sm px-4 py-2`}
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
                คุณต้องการลบประเภทห้องเรียน "{classroomTypeToDelete?.classTypeNameThai}" ใช่หรือไม่?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setClassroomTypeToDelete(null);
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
                {editingId ? 'แก้ไขประเภทห้องเรียน' : 'เพิ่มประเภทห้องเรียน'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    ชื่อประเภทห้องเรียน (ไทย)
                  </label>
                  <input
                    type="text"
                    value={formData.classTypeNameThai}
                    onChange={(e) => setFormData({ ...formData, classTypeNameThai: e.target.value })}
                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    ชื่อประเภทห้องเรียน (อังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={formData.classTypeNameEng}
                    onChange={(e) => setFormData({ ...formData, classTypeNameEng: e.target.value })}
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

export default ClassroomTypeManage;

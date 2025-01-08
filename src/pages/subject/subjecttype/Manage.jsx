import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";

const SubjectTypeManage = () => {
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectTypeToDelete, setSubjectTypeToDelete] = useState(null);
  const [formData, setFormData] = useState({ 
    subTypeCode: '', 
    subTypeNameThai: '', 
    subTypeNameEng: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchSubjectTypes = async () => {
    try {
      const response = await axios.get(`${HOSTNAME}/a/subjects/type`);
      setSubjectTypes(response.data);
    } catch (error) {
      setError('ไม่สามารถดึงข้อมูลประเภทวิชาได้');
    }
  };

  useEffect(() => {
    fetchSubjectTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${HOSTNAME}/a/subject/type/${editingId}`, formData);
      } else {
        await axios.post(`${HOSTNAME}/a/subject/type`, formData);
      }
      setIsModalOpen(false);
      setFormData({ subTypeCode: '', subTypeNameThai: '', subTypeNameEng: '' });
      setEditingId(null);
      fetchSubjectTypes();
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการดำเนินการ');
    }
  };

  const handleEdit = (subjectType) => {
    setFormData(subjectType);
    setEditingId(subjectType.subTypeId);
    setIsModalOpen(true);
  };

  const handleDelete = (subjectType) => {
    setSubjectTypeToDelete(subjectType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!subjectTypeToDelete) return;
    
    try {
      await axios.delete(`${HOSTNAME}/a/subject/type/${subjectTypeToDelete.subTypeId}`);
      await fetchSubjectTypes();
    } catch (error) {
      setError('ลบไม่สำเร็จ');
      return;
    } finally {
      setIsDeleteModalOpen(false);
      setSubjectTypeToDelete(null);
    }
  };

  return (
    <div>
      <h1>จัดการประเภทวิชา</h1>
      <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({ subTypeCode: '', subTypeNameThai: '', subTypeNameEng: '' });
            setEditingId(null);
          }}
          className="mb-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          เพิ่มประเภทวิชา
        </button>

        <div className="rounded-lg border border-gray-200">
          <div className="overflow-x-auto rounded-t-lg">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสประเภทวิชา</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทวิชา (ไทย)</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทวิชา (อังกฤษ)</th>
                  <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subjectTypes.map((type) => (
                  <tr key={type.subTypeId}>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeCode}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeNameThai}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeNameEng}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <button
                        onClick={() => handleEdit(type)}
                        className="mr-2 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(type)}
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
                คุณต้องการลบประเภทวิชา "{subjectTypeToDelete?.subTypeNameThai}" ใช่หรือไม่?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSubjectTypeToDelete(null);
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
                {editingId ? 'แก้ไขประเภทวิชา' : 'เพิ่มประเภทวิชา'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    รหัสประเภทวิชา
                  </label>
                  <input
                    type="text"
                    value={formData.subTypeCode}
                    onChange={(e) => setFormData({ ...formData, subTypeCode: e.target.value })}
                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                    maxLength={10}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    ชื่อประเภทวิชา (ไทย)
                  </label>
                  <input
                    type="text"
                    value={formData.subTypeNameThai}
                    onChange={(e) => setFormData({ ...formData, subTypeNameThai: e.target.value })}
                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    ชื่อประเภทวิชา (อังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={formData.subTypeNameEng}
                    onChange={(e) => setFormData({ ...formData, subTypeNameEng: e.target.value })}
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

export default SubjectTypeManage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";

const SubjectTypeManage = () => {
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectTypeToDelete, setSubjectTypeToDelete] = useState(null);
  const [formData, setFormData] = useState({ 
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
      setFormData({  subTypeNameThai: '', subTypeNameEng: '' });
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
      <h1 className="font-bold text-center">จัดการกลุ่มสาระการเรียนรู้</h1>
      <div className="mt-5">
        {error && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500">{error}</p>
          </div>
        )}
        <div className="mb-4 sm:mb-6 flex justify-end">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData({ subTypeNameThai: '', subTypeNameEng: '' });
              setEditingId(null);
            }}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มประเภทวิชา
          </button>
        </div>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="rounded-lg border border-gray-200">
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                  <tr>
                    {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสประเภทวิชา</th> */}
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทวิชา (ไทย)</th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">ชื่อประเภทวิชา (อังกฤษ)</th>
                    <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjectTypes.map((type) => (
                    <tr key={type.subTypeId}>
                      {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeCode}</td> */}
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeNameThai}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeNameEng}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        <button
                          onClick={() => handleEdit(type)}
                          className="inline-flex justify-center items-center px-4 py-2 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(type)}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
                  {/* <div>
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
                  </div> */}
                  
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
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {editingId ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          บันทึก
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          เพิ่ม
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectTypeManage;

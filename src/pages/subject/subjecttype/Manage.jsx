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
        <div>
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className='text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    {/* <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">รหัสประเภทวิชา</th> */}
                    <th className="px-6 py-3">ชื่อประเภทวิชา (ไทย)</th>
                    <th className="px-6 py-3">ชื่อประเภทวิชา (อังกฤษ)</th>
                    <th className="px-6 py-3">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectTypes.map((type) => (
                    <tr key={type.subTypeId} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                      {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">{type.subTypeCode}</td> */}
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{type.subTypeNameThai}</td>
                      <td className="px-6 py-4">{type.subTypeNameEng}</td>
                      <td className="px-6 py-4">
                      <span className='inline-flex overflow-hidden rounded-md border bg-white shadow-sm'>
                        <button
                          className="inline-block p-3 text-blue-600 hover:bg-gray-50 focus:relative"
                          onClick={() => handleEdit(type)}
                      
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          className="inline-block p-3 text-red-600 hover:bg-gray-50 focus:relative"
                          onClick={() => handleDelete(type)}
                       
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

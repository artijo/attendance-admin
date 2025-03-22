import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOSTNAME } from "../../../config.js";
import { Link } from 'react-router-dom';

const ClassroomTypeManage = () => {
  const [classroomTypes, setClassroomTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classroomTypeToDelete, setClassroomTypeToDelete] = useState(null);
  const [formData, setFormData] = useState({ classTypeNameThai: '', classTypeNameEng: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchClassroomTypes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${HOSTNAME}/a/classrooms/types`);
      setClassroomTypes(response.data);
      setError('');
    } catch (error) {
      setError('ไม่สามารถดึงข้อมูลประเภทห้องเรียนได้');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">จัดการประเภทห้องเรียน</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {classroomTypes.length > 0 && (
          <div className="mb-3 sm:mb-0 bg-white rounded-lg px-4 py-2 border border-line shadow-sm">
            <span className="text-text-color-alt font-body">จำนวนประเภทห้องเรียนทั้งหมด:</span>
            <span className="ml-2 font-medium text-primary text-lg font-heading">{classroomTypes.length} ประเภท</span>
          </div>
        )}
        
        <button
          onClick={() => {
            setIsModalOpen(true);
            setFormData({ classTypeNameThai: '', classTypeNameEng: '' });
            setEditingId(null);
            setError('');
          }}
          className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          เพิ่มประเภทห้องเรียน
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>{error}</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : classroomTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-line">
          <div className="flex justify-center mb-4 text-text-color-alt">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-color mb-2 font-heading">ไม่พบข้อมูลประเภทห้องเรียน</h2>
          <p className="text-text-color-alt font-body">กรุณาเพิ่มประเภทห้องเรียนใหม่</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-color-alt font-medium uppercase tracking-wider bg-gray-50 border-b border-line">
                <tr>
                  <th className="px-6 py-4">ชื่อประเภทห้องเรียน (ไทย)</th>
                  <th className="px-6 py-4">ชื่อประเภทห้องเรียน (อังกฤษ)</th>
                  <th className="px-6 py-4 text-center" width="180">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classroomTypes.map((type) => (
                  <tr key={type.classTypeId} className={`hover:bg-gray-50 transition-colors duration-150 ${isProtectedType(type) ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-text-color">
                      {isProtectedType(type) ? (
                        <div className="flex items-center">
                          {type.classTypeNameThai}
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">ค่าเริ่มต้นระบบ</span>
                        </div>
                      ) : (
                        type.classTypeNameThai
                      )}
                    </td>
                    <td className="px-6 py-4">{type.classTypeNameEng}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex overflow-hidden rounded-md border border-line bg-white shadow-sm">
                        <button
                          className={`inline-block p-2.5 ${isProtectedType(type) ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-gray-50'} focus:relative`}
                          onClick={() => !isProtectedType(type) && handleEdit(type)}
                          title={isProtectedType(type) ? "ไม่สามารถแก้ไขประเภทนี้ได้" : "แก้ไขข้อมูล"}
                          disabled={isProtectedType(type)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          className={`inline-block p-2.5 ${isProtectedType(type) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:bg-gray-50'} focus:relative`}
                          onClick={() => !isProtectedType(type) && handleDelete(type)}
                          title={isProtectedType(type) ? "ไม่สามารถลบประเภทนี้ได้" : "ลบข้อมูล"}
                          disabled={isProtectedType(type)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
          to="/classroom" 
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับไปหน้ารายการห้องเรียน
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
            <div className="text-center mb-5">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-color font-heading mb-2">ยืนยันการลบ</h3>
              <p className="text-text-color-alt font-body">
                คุณต้องการลบประเภทห้องเรียน "{classroomTypeToDelete?.classTypeNameThai}" ใช่หรือไม่?
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setClassroomTypeToDelete(null);
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-line">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-text-color font-heading mb-2">
                {editingId ? 'แก้ไขประเภทห้องเรียน' : 'เพิ่มประเภทห้องเรียน'}
              </h3>
              <div className="h-1 w-10 bg-secondary rounded-full"></div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-color font-body flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ชื่อประเภทห้องเรียน (ไทย) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.classTypeNameThai}
                    onChange={(e) => setFormData({ ...formData, classTypeNameThai: e.target.value })}
                    className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                    required
                    maxLength={100}
                    placeholder="กรอกชื่อประเภทห้องเรียนภาษาไทย"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-color font-body flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    ชื่อประเภทห้องเรียน (อังกฤษ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.classTypeNameEng}
                    onChange={(e) => setFormData({ ...formData, classTypeNameEng: e.target.value })}
                    className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                    required
                    maxLength={100}
                    placeholder="กรอกชื่อประเภทห้องเรียนภาษาอังกฤษ"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      บันทึก
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

export default ClassroomTypeManage;

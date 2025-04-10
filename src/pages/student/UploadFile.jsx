import { useState, useCallback, useEffect } from "react";
import * as XLSX from 'xlsx';
import axios from 'axios';
import { HOSTNAME } from "../../config";
import { useNavigate, Link } from "react-router-dom";

const StudentColumns = {
  NO: 'No',
  STUDENT_ID: 'studentID',
  TITLE: 'title',
  FIRSTNAME: 'firstname',
  LASTNAME: 'lastname',
  CLASS: 'class',
  ROOM: 'room'
};

function UploadWithFile() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [sheetsData, setSheetsData] = useState({}); // Store data for all sheets
  const [editingCell, setEditingCell] = useState({ sheetName: null, rowId: null, field: null, value: null }); // Track editing by sheet and field
  const [selectedSheet, setSelectedSheet] = useState('');
  const [sheetList, setSheetList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [modifiedData, setModifiedData] = useState({}); // Track modified records
  const [allStudents, setAllStudents] = useState([]);
  const navigate = useNavigate();

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(HOSTNAME+'/a/students');
      if (response.status === 200) {
        setAllStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching all students:', error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const acceptedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload only Excel or CSV files");
      return false;
    }
    setError("");
    return true;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFile(files[0]);
      }
    }
  }, []);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (validateFile(e.target.files[0])) {
        setFile(e.target.files[0]);
      }
    }
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Set available sheets
      setSheetList(workbook.SheetNames);
      setSelectedSheet(workbook.SheetNames[0]); // Select first sheet by default
      
      // Process all sheets
      const allSheetsData = {};
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const validData = jsonData.map((row, index) => ({
          id: index,
          no: row[StudentColumns.NO],
          studentId: String(row[StudentColumns.STUDENT_ID]), // Convert to string
          title: row[StudentColumns.TITLE],
          firstName: row[StudentColumns.FIRSTNAME],
          lastName: row[StudentColumns.LASTNAME],
          class: row[StudentColumns.CLASS],
          room: row[StudentColumns.ROOM]
        }));
        
        allSheetsData[sheetName] = validData;
      });

      setSheetsData(allSheetsData);
    };
    reader.readAsArrayBuffer(file);
  };

  const onFileUpload = () => {
    if (!file) return;
    readExcelFile(file);
  };

  const handleEdit = (sheetName, rowId, field) => {
    const currentValue = sheetsData[sheetName].find(row => row.id === rowId)[field];
    setEditingCell({ sheetName, rowId, field, value: currentValue });
  };

  const handleSave = () => {
    const { sheetName, rowId, field, value } = editingCell;
    if (sheetName && rowId !== null && field && value !== null) {
      // Update sheetsData
      setSheetsData(prev => ({
        ...prev,
        [sheetName]: prev[sheetName].map(row =>
          row.id === rowId ? { ...row, [field]: value } : row
        )
      }));

      // Track modified data
      setModifiedData(prev => ({
        ...prev,
        [sheetName]: {
          ...prev[sheetName],
          [rowId]: {
            ...(prev[sheetName]?.[rowId] || {}),
            ...sheetsData[sheetName].find(row => row.id === rowId),
            [field]: value,
            originalData: sheetsData[sheetName].find(row => row.id === rowId)
          }
        }
      }));
    }
    setEditingCell({ sheetName: null, rowId: null, field: null, value: null });
  };

  const handleChange = (newValue) => {
    setEditingCell(prev => ({ ...prev, value: newValue }));
  };

  const handleKeyDown = (e) => {
    const { sheetName, rowId, field } = editingCell;
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const fields = ['studentId', 'title', 'firstName', 'lastName', 'class', 'room'];
      const currentIndex = fields.indexOf(field);
      const nextField = fields[currentIndex + 1];
      
      if (nextField) {
        handleSave();
        handleEdit(sheetName, rowId, nextField);
      } else {
        handleSave();
      }
    }
  };

  const checkStudentExists = (studentId) => {
    return allStudents.some(student => student.stdId === studentId);
  };

  // Function to check if a student record has all required fields
  const hasRequiredFields = (student) => {
    const requiredFields = ['studentId', 'firstName', 'lastName', 'class', 'room'];
    return requiredFields.every(field => 
      student[field] !== undefined && 
      student[field] !== null && 
      student[field] !== ''
    );
  };

  const handleSaveToServer = async () => {
    try {
      setIsSaving(true);
      setSaveError("");
      
      // Prepare only new students data from all sheets
      const newStudentsToSave = {};
      Object.keys(sheetsData).forEach(sheetName => {
        // Filter only new students (those that don't exist) and have all required fields
        const newStudents = sheetsData[sheetName].filter(student => 
          !checkStudentExists(student.studentId) && 
          hasRequiredFields(student)
        ).map(student => ({
          ...student,
          isModified: Boolean(modifiedData[sheetName]?.[student.id])
        }));

        if (newStudents.length > 0) {
          newStudentsToSave[sheetName] = newStudents;
        }
      });

      // If no new students, show message and return
      if (Object.keys(newStudentsToSave).length === 0) {
        alert('ไม่มีข้อมูลนักเรียนใหม่ที่ต้องเพิ่ม');
        setIsSaving(false);
        return;
      }

      const dataToSave = {
        sheets: newStudentsToSave
      };



      const response = await axios.post(HOSTNAME+'/a/students/bulk', dataToSave);
      
      if (response.status === 200) {
        setModifiedData({});
        navigate('/students');
        fetchAllStudents(); // Refresh the students list
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Error saving data to server');
    } finally {
      setIsSaving(false);
    }
  };

  // Table component for each sheet
  const TableForSheet = ({ sheetName, data }) => (
    <div key={sheetName} className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Sheet: {sheetName}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={`${sheetName}-${row.id}`} 
                  className={modifiedData[sheetName]?.[row.id] ? 'bg-yellow-50' : 
                  !hasRequiredFields(row) ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!hasRequiredFields(row) ? (
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
                      ข้อมูลไม่ครบ - จะข้าม
                    </span>
                  ) : checkStudentExists(row.studentId) ? (
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
                      Exists - Will Skip
                    </span>
                  ) : (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                      New - Will Add
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{row.no}</td>
                {Object.entries({
                  studentId: 'Student ID',
                  title: 'Title',
                  firstName: 'First Name',
                  lastName: 'Last Name',
                  class: 'Class',
                  room: 'Room'
                }).map(([field, label]) => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap">
                    {editingCell.sheetName === sheetName && 
                     editingCell.rowId === row.id && 
                     editingCell.field === field ? (
                      <input
                        type="text"
                        value={editingCell.value}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        className="border p-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <div 
                        onClick={() => handleEdit(sheetName, row.id, field)}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        {row[field]}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell.sheetName === sheetName && editingCell.rowId === row.id ? (
                    <button onClick={handleSave} className="text-green-600 hover:text-green-900">
                      Save
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEdit(sheetName, row.id, 'studentId')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">อัปโหลดไฟล์ข้อมูลนักเรียน</h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Link 
          to="/students" 
          className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับไปหน้ารายการนักเรียน
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-text-color font-heading mb-2">อัปโหลดไฟล์ Excel หรือ CSV</h2>
            <p className="text-text-color-alt font-body mb-4 text-sm">รองรับไฟล์ Excel (.xlsx, .xls) และ CSV สำหรับการนำเข้าข้อมูลนักเรียนหลายรายการพร้อมกัน</p>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5"
                : file 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={onFileChange}
              className="hidden"
              id="fileInput"
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              {!file ? (
                <>
                  <svg
                    className="w-16 h-16 text-primary/70 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-text-color font-medium font-body mb-2">
                    ลากไฟล์วางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                  </p>
                  <p className="text-sm text-text-color-alt font-body">
                    รองรับไฟล์ Excel และ CSV เท่านั้น
                  </p>
                </>
              ) : (
                <>
                  <svg 
                    className="w-16 h-16 text-green-500 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.5" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <p className="text-green-600 font-medium font-body mb-2">
                    ไฟล์พร้อมอัปโหลด
                  </p>
                  <p className="text-sm text-text-color font-body mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-color-alt font-body">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                </>
              )}
              
              {error && <p className="text-red-500 text-sm mt-4 font-body bg-red-50 p-2 rounded-lg">{error}</p>}
            </label>
          </div>
          
          {file && (
            <div className="flex justify-center mt-5">
              <button
                onClick={onFileUpload}
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                อัปโหลดไฟล์
              </button>
            </div>
          )}
        </div>
      </div>

      {sheetList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-text-color font-heading">ข้อมูลนักเรียนจากไฟล์</h2>
                <p className="text-sm text-text-color-alt font-body mt-1">เลือกและแก้ไขข้อมูลก่อนนำเข้า</p>
              </div>
              
              {sheetList.length > 1 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-text-color font-body">เลือกชีท:</label>
                  <select
                    value={selectedSheet}
                    onChange={(e) => setSelectedSheet(e.target.value)}
                    className="rounded-lg border-gray-300 py-2 px-3 shadow-sm text-sm focus:border-primary focus:ring-primary font-body text-text-color"
                  >
                    {sheetList.map(sheet => (
                      <option key={sheet} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedSheet && sheetsData[selectedSheet] && (
              <div className="mb-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-line rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">สถานะ</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ลำดับ</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">รหัสนักเรียน</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">คำนำหน้า</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ชื่อ</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">นามสกุล</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ชั้น</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">ห้อง</th>
                      <th className="px-4 py-3.5 text-left text-xs font-medium text-text-color-alt tracking-wider font-heading">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sheetsData[selectedSheet].map((row) => (
                      <tr key={`${selectedSheet}-${row.id}`} 
                          className={!hasRequiredFields(row) ? 'bg-red-50' : 
                          modifiedData[selectedSheet]?.[row.id] ? 'bg-yellow-50' : ''}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {!hasRequiredFields(row) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              ข้อมูลไม่ครบ
                            </span>
                          ) : checkStudentExists(row.studentId) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              มีในระบบแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              เพิ่มใหม่
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-body text-text-color">{row.no}</td>
                        {/* Cell fields */}
                        {Object.entries({
                          studentId: 'รหัสนักเรียน',
                          title: 'คำนำหน้า',
                          firstName: 'ชื่อ',
                          lastName: 'นามสกุล',
                          class: 'ชั้น',
                          room: 'ห้อง'
                        }).map(([field, label]) => (
                          <td key={field} className="px-4 py-3 whitespace-nowrap text-sm font-body">
                            {editingCell.sheetName === selectedSheet && 
                            editingCell.rowId === row.id && 
                            editingCell.field === field ? (
                              <input
                                type="text"
                                value={editingCell.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleSave}
                                className="w-full border border-primary rounded-md p-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none font-body"
                                autoFocus
                              />
                            ) : (
                              <div 
                                onClick={() => handleEdit(selectedSheet, row.id, field)}
                                className="cursor-pointer hover:bg-gray-50 p-1.5 rounded-md transition-colors text-text-color"
                              >
                                {row[field]}
                              </div>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {editingCell.sheetName === selectedSheet && editingCell.rowId === row.id ? (
                            <button 
                              onClick={handleSave} 
                              className="text-primary hover:text-accent font-medium transition-colors"
                            >
                              บันทึก
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEdit(selectedSheet, row.id, 'studentId')}
                              className="text-primary hover:text-accent font-medium transition-colors"
                            >
                              แก้ไข
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-5 mt-6">
              <div className="text-sm text-text-color-alt font-body">
                จำนวนชีททั้งหมด: <span className="font-medium text-text-color">{Object.keys(sheetsData).length}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {saveError && (
                  <div className="text-red-500 text-sm font-body bg-red-50 px-3 py-2 rounded-lg">
                    {saveError}
                  </div>
                )}
                
                <button
                  onClick={handleSaveToServer}
                  disabled={isSaving}
                  className={`inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white transition-colors duration-300
                    ${isSaving 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      บันทึกข้อมูล
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadWithFile;
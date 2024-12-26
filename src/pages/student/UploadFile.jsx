import { useState, useCallback } from "react";
import * as XLSX from 'xlsx';
import axios from 'axios'; // Add this import
import { HOSTNAME } from "../../config";

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
          studentId: row[StudentColumns.STUDENT_ID],
          title: row[StudentColumns.TITLE],
          firstName: row[StudentColumns.FIRSTNAME],
          lastName: row[StudentColumns.LASTNAME],
          class: row[StudentColumns.CLASS],
          room: row[StudentColumns.ROOM]
        }));
        
        allSheetsData[sheetName] = validData;
      });

      setSheetsData(allSheetsData);
      console.log("All Sheets Data:", allSheetsData);
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

  const handleSaveToServer = async () => {
    try {
      setIsSaving(true);
      setSaveError("");
      
      // Prepare all sheets data
      const allSheetsToSave = {};
      Object.keys(sheetsData).forEach(sheetName => {
        allSheetsToSave[sheetName] = sheetsData[sheetName].map(student => ({
          ...student,
          isModified: Boolean(modifiedData[sheetName]?.[student.id])
        }));
      });

      const dataToSave = {
        sheets: allSheetsToSave
      };

      console.log("Saving all sheets data:", dataToSave);

      const response = await axios.post(HOSTNAME+'/a/students/bulk', dataToSave);
      
      if (response.status === 200) {
        // Clear all modified data after successful save
        setModifiedData({});
        alert('All sheets data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
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
                  className={modifiedData[sheetName]?.[row.id] ? 'bg-yellow-50' : ''}>
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
    <div className="p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
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
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600 mb-2">
            Drag & Drop Excel or CSV files here or click to select
          </p>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {file && (
            <p className="text-sm text-gray-500">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </label>
      </div>
      {file && (
        <button
          onClick={onFileUpload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Upload File
        </button>
      )}
      {sheetList.length > 0 && (
        <div className="mt-4 mb-4">
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sheetList.map(sheet => (
              <option key={sheet} value={sheet}>
                {sheet}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSheet && sheetsData[selectedSheet] && (
        <>
          <TableForSheet 
            sheetName={selectedSheet} 
            data={sheetsData[selectedSheet]} 
          />
          
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Total sheets: {Object.keys(sheetsData).length}
            </div>
            <div className="flex items-center gap-4">
              {saveError && (
                <p className="text-red-500 text-sm">{saveError}</p>
              )}
              <button
                onClick={handleSaveToServer}
                disabled={isSaving}
                className={`px-6 py-2 rounded-md text-white font-medium
                  ${isSaving 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                {isSaving ? 'Saving...' : 'Save All Sheets'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UploadWithFile;
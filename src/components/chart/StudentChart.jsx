import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StudentChart({ classrooms, students, initialShowChart = true }) {
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(initialShowChart);

  // Generate chart data whenever classrooms or students data changes
  useEffect(() => {
    if (!classrooms || !students) return;
    
    // Group students by classroom
    const studentsByClassroom = {};
    const studentNamesListByClassroom = {};
    
    // Initialize with 0 students for each classroom
    classrooms.forEach(classroom => {
      const classKey = `ม.${classroom.classLevel}/${classroom.classRoom}`;
      studentsByClassroom[classKey] = 0;
      studentNamesListByClassroom[classKey] = [];
    });
    
    // Count students in each classroom and store student names
    students.forEach(student => {
      if (student.classroomMembers && student.classroomMembers.length > 0) {
        student.classroomMembers.forEach(member => {
          if (member.classroom) {
            const classKey = `ม.${member.classroom.classLevel}/${member.classroom.classRoom}`;
            if (studentsByClassroom[classKey] !== undefined) {
              // Count student
              studentsByClassroom[classKey]++;
              
              // Store student name
              if (!studentNamesListByClassroom[classKey]) {
                studentNamesListByClassroom[classKey] = [];
              }
              
              // Format: "รหัสนักเรียน: ชื่อ นามสกุล" (ถ้ามีรหัสนักเรียน)
              const studentName = student.stdId 
                ? `${student.stdId}: ${student.fName} ${student.lName}`
                : `${student.fName} ${student.lName}`;
                
              studentNamesListByClassroom[classKey].push(studentName);
            }
          }
        });
      }
    });
    
    // Sort classrooms by level and room number
    const sortedClassroomKeys = Object.keys(studentsByClassroom).sort((a, b) => {
      const [levelA, roomA] = a.replace('ม.', '').split('/').map(Number);
      const [levelB, roomB] = b.replace('ม.', '').split('/').map(Number);
      
      if (levelA !== levelB) return levelA - levelB;
      return roomA - roomB;
    });
    
    // Prepare chart data
    setChartData({
      labels: sortedClassroomKeys,
      datasets: [
        {
          label: 'จำนวนนักเรียน',
          data: sortedClassroomKeys.map(key => studentsByClassroom[key]),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          studentsList: sortedClassroomKeys.map(key => studentNamesListByClassroom[key] || [])
        },
      ],
    });
  }, [classrooms, students]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'lineseed',
          }
        }
      },
      title: {
        display: true,
        text: 'จำนวนนักเรียนแต่ละห้องเรียน',
        font: {
          family: 'lineseed',
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label || '';
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} คน`;
          },
          afterLabel: function(context) {
            // Get students list from dataset
            const studentsList = context.dataset.studentsList[context.dataIndex] || [];
            
            // If no students, return empty
            if (!studentsList.length) return [];
            
            // Return list of students with bullet points
            return [
              '',
              'รายชื่อนักเรียนในห้องเรียน:',
              ...studentsList.map(name => `• ${name}`)
            ];
          }
        },
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'lineseed',
          size: 14
        },
        bodyFont: {
          family: 'lineseed',
          size: 13
        },
        bodySpacing: 5,
        boxPadding: 3,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'จำนวนนักเรียน (คน)',
          font: {
            family: 'lineseed',
          }
        },
        ticks: {
          font: {
            family: 'lineseed',
          },
          stepSize: 1, // กำหนดขนาดขั้นให้เป็น 1
          precision: 0, // ไม่มีทศนิยม
          callback: function(value) {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'ห้องเรียน',
          font: {
            family: 'lineseed',
          }
        },
        ticks: {
          font: {
            family: 'lineseed',
          }
        }
      },
    },
  };

  if (!chartData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-primary font-heading">แผนภูมิจำนวนนักเรียนตามห้องเรียน</h3>
        <button 
          onClick={() => setShowChart(!showChart)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        >
          {showChart ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 015.5 8.25" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.621 6.503C10.385 6.192 11.176 6 12 6c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411" />
                <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              ซ่อนแผนภูมิ
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              แสดงแผนภูมิ
            </>
          )}
        </button>
      </div>
      {showChart && (
        <div className="relative h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default StudentChart;
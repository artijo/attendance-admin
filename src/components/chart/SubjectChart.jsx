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

function SubjectChart({ subjects, subjectTypes, initialShowChart = true }) {
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(initialShowChart);

  // Generate chart data whenever subjects or subjectTypes data changes
  useEffect(() => {
    if (!subjects || !subjectTypes || subjectTypes.length === 0) return;
    
    // Filter out the "all" option if it exists
    const filteredTypes = subjectTypes.filter(type => type.value !== "all");
    
    // Initialize count for each subject type
    const subjectsByType = {};
    filteredTypes.forEach(type => {
      subjectsByType[type.label] = 0;
    });
    
    // Count subjects in each type
    subjects.forEach(subject => {
      if (subject.subjectType && subject.subjectType.subTypeNameThai) {
        subjectsByType[subject.subjectType.subTypeNameThai] = 
          (subjectsByType[subject.subjectType.subTypeNameThai] || 0) + 1;
      }
    });
    
    // Sort types by name
    const sortedTypeNames = Object.keys(subjectsByType).sort();
    
    // Prepare chart data
    setChartData({
      labels: sortedTypeNames,
      datasets: [
        {
          label: 'จำนวนวิชา',
          data: sortedTypeNames.map(typeName => subjectsByType[typeName]),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [subjects, subjectTypes]);

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
        text: 'จำนวนวิชาตามกลุ่มสาระการเรียนรู้',
        font: {
          family: 'lineseed',
          size: 16,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'จำนวนวิชา',
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
          text: 'กลุ่มสาระการเรียนรู้',
          font: {
            family: 'Anakotmai Light',
          }
        },
        ticks: {
          font: {
            family: 'Anakotmai Light',
          },
          maxRotation: 45,
          minRotation: 45
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
        <h3 className="text-lg font-medium text-primary font-heading">แผนภูมิจำนวนวิชาตามกลุ่มสาระการเรียนรู้</h3>
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

export default SubjectChart;
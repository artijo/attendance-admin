import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ActivityChart({ continuousActivities, nonContinuousActivities, initialShowChart = true }) {
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(initialShowChart);

  // Generate chart data whenever activities data changes
  useEffect(() => {
    if (!continuousActivities && !nonContinuousActivities) return;
    
    const continuousCount = continuousActivities?.length || 0;
    const nonContinuousCount = nonContinuousActivities?.length || 0;
    
    // Prepare chart data
    setChartData({
      labels: ['กิจกรรมต่อเนื่อง', 'กิจกรรมไม่ต่อเนื่อง'],
      datasets: [
        {
          label: 'จำนวนกิจกรรม',
          data: [continuousCount, nonContinuousCount],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [continuousActivities, nonContinuousActivities]);

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
        text: 'สัดส่วนกิจกรรมตามประเภท',
        font: {
          family: 'lineseed',
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} กิจกรรม (${percentage}%)`;
          }
        }
      }
    },
  };

  if (!chartData) {
    return null;
  }

  const totalActivities = (continuousActivities?.length || 0) + (nonContinuousActivities?.length || 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-line mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-primary font-heading">แผนภูมิสัดส่วนกิจกรรม</h3>
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
        <>
          <div className="relative h-80">
            <Pie data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-700">กิจกรรมต่อเนื่อง</p>
              <p className="text-lg font-bold text-blue-800 mt-1">{continuousActivities?.length || 0}</p>
              <p className="text-xs text-blue-600">
                {totalActivities > 0 
                  ? `${(((continuousActivities?.length || 0) / totalActivities) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg">
              <p className="font-medium text-teal-700">กิจกรรมไม่ต่อเนื่อง</p>
              <p className="text-lg font-bold text-teal-800 mt-1">{nonContinuousActivities?.length || 0}</p>
              <p className="text-xs text-teal-600">
                {totalActivities > 0 
                  ? `${(((nonContinuousActivities?.length || 0) / totalActivities) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-gray-50 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-700">จำนวนกิจกรรมทั้งหมด</p>
            <p className="text-xl font-bold text-primary mt-1">{totalActivities} กิจกรรม</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityChart;
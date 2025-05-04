import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HOSTNAME } from '../../config';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { formatThaiDate } from '../../helper';

function ActivityQRpaticipate() {
    const { id: activityId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [activity, setActivity] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null); // No expiration timer
    const [isExpired, setIsExpired] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const timerRef = useRef(null);
    const copyFeedbackTimeoutRef = useRef(null);
    const printAreaRef = useRef(null);

    const generateQRCode = async () => {
        setLoading(true);
        setError(null);
        setIsExpired(false);
        try {
            const packdata = {
                activityId: activityId,
            };
            const response = await axios.post(`${HOSTNAME}/a/activity/generate-qr`, packdata);
            setQrCodeData(response.data);
        } catch (err) {
            console.error('Error generating QR code:', err);
            setError('เกิดข้อผิดพลาดในการสร้าง QR Code กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (qrCodeData && qrCodeData.link) {
            navigator.clipboard.writeText(qrCodeData.link)
                .then(() => {
                    setCopyFeedback(true);
                    if (copyFeedbackTimeoutRef.current) {
                        clearTimeout(copyFeedbackTimeoutRef.current);
                    }
                    copyFeedbackTimeoutRef.current = setTimeout(() => {
                        setCopyFeedback(false);
                    }, 3000);
                })
                .catch(err => {
                    console.error("Failed to copy: ", err);
                });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Add print styles
    useEffect(() => {
        const printStyles = `
            @media print {
                body * {
                    visibility: hidden;
                }
                .print-area {
                    visibility: visible !important;
                    display: block !important;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    padding: 1in;
                }
                .print-area * {
                    visibility: visible !important;
                }
                .print-area {
                    background: white !important;
                    box-shadow: none !important;
                }
                .hidden {
                    display: block !important;
                }
            }
            @page {
                size: A4;
                margin: 0;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerHTML = printStyles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                const response = await axios.get(`${HOSTNAME}/t/activity/${activityId}`);
                setActivity(response.data);
                await generateQRCode();
            } catch (err) {
                console.error('Error fetching activity details:', err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม');
            }
        };

        fetchActivityDetails();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (copyFeedbackTimeoutRef.current) {
                clearTimeout(copyFeedbackTimeoutRef.current);
            }
        };
    }, [activityId]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-line p-12 flex flex-col justify-center items-center h-[400px] animate-fade-in">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-line"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary absolute top-0"></div>
                </div>
                <p className="mt-4 text-text-color-alt font-medium">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-line overflow-hidden animate-fade-in">
                <div className="bg-red-50 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-red-800 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-red-700 mb-6">{error}</p>
                    <button 
                        onClick={generateQRCode}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        ลองใหม่อีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-12">
            <div className="max-w-4xl mx-auto px-4 pt-8">
                {/* Header Section with Animation */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative">
                            <h1 className="text-3xl md:text-4xl font-bold text-primary font-heading">
                                QR Code กิจกรรม
                            </h1>
                            <div className="mt-2 h-1.5 w-24 bg-secondary rounded-full"></div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary/10 rounded-full blur-md animate-pulse"></div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={handlePrint} 
                                className="bg-white text-primary border border-line px-5 py-2.5 rounded-lg inline-flex items-center hover:bg-primary/5 transition-colors shadow-sm group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10" />
                                </svg>
                                พิมพ์ QR Code
                            </button>
                            <Link
                                to={`/activities/${activityId}`}
                                className="bg-white text-primary border border-line px-5 py-2.5 rounded-lg inline-flex items-center hover:bg-primary/5 transition-colors shadow-sm group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                กลับไปหน้ารายละเอียดกิจกรรม
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-line overflow-hidden animate-fade-in">
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-primary mb-6">รายละเอียดกิจกรรม</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-color mb-2">ชื่อกิจกรรม:</label>
                                        <p className="text-lg font-semibold text-text-color">{activity?.actName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-color mb-2">วันที่จัดกิจกรรม:</label>
                                        <p className="text-text-color">{formatThaiDate(activity?.actDate)} - {formatThaiDate(activity?.actDateEnd)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-color mb-2">เวลา:</label>
                                        <p className="text-text-color">{activity?.actStartTime} - {activity?.actEndTime} น.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-color mb-2">สถานที่:</label>
                                        <p className="text-text-color">{activity?.actLocation}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-color mb-2">ประเภทกิจกรรม:</label>
                                        <p className="text-text-color">{activity?.activityType?.actTypeName}</p>
                                    </div>
                                    {activity?.teacher && activity?.teacher.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-text-color mb-2">ครูผู้ดูแล:</label>
                                            <ul className="list-disc list-inside text-text-color">
                                                {activity.teacher.map((t) => (
                                                    <li key={t.actTeacherId}>
                                                        {t.teacher.fName} {t.teacher.lName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="mt-8">
                                        <button 
                                            onClick={handleCopyLink} 
                                            className={`bg-white text-primary border border-line px-5 py-2.5 rounded-lg inline-flex items-center hover:bg-primary/5 transition-colors shadow-sm group ${copyFeedback ? 'bg-primary/5' : ''}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M8 16h.01" />
                                            </svg>
                                            {copyFeedback ? 'ลิงค์คัดลอกแล้ว!' : 'คัดลอกลิงค์'}
                                        </button>
                                        <button 
                                            onClick={generateQRCode} 
                                            className="bg-white text-primary border border-line px-5 py-2.5 rounded-lg inline-flex items-center hover:bg-primary/5 transition-colors shadow-sm group ml-4"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            สร้าง QR Code ใหม่
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-primary mb-6">QR Code กิจกรรม</h2>
                                <p className="text-text-color-alt mb-8">สแกน QR Code นี้เพื่อเข้าร่วมกิจกรรม</p>
                                <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
                                    <QRCode
                                        value={qrCodeData?.link}
                                        size={250}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden">
                        <div ref={printAreaRef} className="print-area p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-primary mb-4">QR Code กิจกรรม</h2>
                                <p className="text-text-color-alt">สแกน QR Code นี้เพื่อเข้าร่วมกิจกรรม</p>
                            </div>
                            <div className="mb-8 flex justify-center">
                                <QRCode
                                    value={qrCodeData?.link}
                                    size={300}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-color mb-1">ชื่อกิจกรรม:</label>
                                    <p className="text-lg font-semibold text-text-color">{activity?.actName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-color mb-1">วันที่จัดกิจกรรม:</label>
                                    <p className="text-text-color">{formatThaiDate(activity?.actDate)} - {formatThaiDate(activity?.actDateEnd)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-color mb-1">เวลา:</label>
                                    <p className="text-text-color">{activity?.actStartTime} - {activity?.actEndTime} น.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-color mb-1">สถานที่:</label>
                                    <p className="text-text-color">{activity?.actLocation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityQRpaticipate;
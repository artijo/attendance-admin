import React, { useEffect, useState } from "react";
import { HOSTNAME } from "../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { number } from "prop-types";
import SelectTerm from "../../components/holiday/createholiday/selectterm";
import AddHoliday from "../../components/holiday/createholiday/addholiday";
import { formatDateToThaiStyle } from "../../helper";
import { set } from "react-hook-form";


function CreateHoliday() {

    const [stepProcess, setStepProcess] = useState(1);
    // term section
    const [selectedTerm, setSelectedTerm] = useState("default");
    const [termInformation, setTermInformation] = useState({});
    // holiday section
    const [holidayList, setHolidayList] = useState([]);

    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();


    const stepNumberToThaiText = (number) => {
        // console.log(number);
        switch (number) {
            case 1:
                return "เลือกเทอม"
            case 2:
                return "เพิ่มรายการวันหยุด"
            default:
                return "เลข step ไม่ถูกต้อง"
        }
    };

    const nextStep = () => {
        let step = stepProcess + 1;
        if (step > 3) {
            step = stepProcess
        };
        setStepProcess(step);
    };

    const prevStep = () => {
        let step = stepProcess - 1;
        if (step < 1) {
            step = stepProcess
        };
        setStepProcess(step);
    }

    const callApiAddHoliday = async () => {

        try {
            setIsSubmitting(true);
            const response = await axios.post(`${HOSTNAME}/a/holiday`, { holidayList: holidayList, termId: selectedTerm });
            if (!response.status === 200) {
                throw new Error(response.data.message);
            }
        } catch (error) {
            // console.error(error);
            setMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างข้อมูล");
            setError(true);
        } finally {
            let state = {
                title: "บันทึกสำเร็จ",
                status: true,
                msg: `เพิ่มรายการวันหยุดของ ปีการศึกษา ${termInformation.academicYear + 543} เทอม ${termInformation.semester} เข้าสู่ระบบแล้ว`
            }
            setIsSubmitting(false);
            navigate("/holiday", { state: state})
        }

    };

    return (
        <div className="min-h-screen ">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มวันหยุด</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium text-text-color font-heading">
                            เพิ่มวันหยุดใหม่
                        </h2>
                        <p className="text-sm text-text-color-alt font-body">เพิ่มและจัดการรายการวันหยุดในระบบ</p>
                    </div>
                </div>

                <Link
                    to="/holiday"
                    className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้ารายการวันหยุด
                </Link>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="text-sm p-6">
                    <ul className="flex flex-row gap-5 cursor-default">
                        {[1, 2].map((step, index) => (
                            /*
                                1 = เลือกเทอม
                                2 = เพิ่มรายการวันหยุดและบันทึกวันหยุดเข้าสู่ระบบ
                            
                            */

                            <React.Fragment key={index}>
                                <li>
                                    <div className="flex flex-row gap-1.5 items-center">
                                        <p className={`${stepProcess === step ? "bg-primary text-white" : "bg-gray-200 text-gray-500"} font-bold  bg-gray-200 rounded-full w-[24px] h-[24px] flex justify-center items-center`}>{step}</p>
                                        <p className={`${stepProcess === step ? "font-bold text-primary" : "font-medium text-gray-500"} text-nowrap`}>{stepNumberToThaiText(step)}</p>
                                    </div>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
                <div className="p-6 pt-1">
                    {stepProcess == 1 && (
                        <div>
                            <SelectTerm selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} setTermInformation={setTermInformation} nextStep={nextStep} />
                        </div>

                    )}
                    {stepProcess == 2 && (
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>

                                </div>
                                <div>
                                    <h2 className="text-base font-medium text-text-color font-heading">
                                        <p>{`ปีการศึกษา ${termInformation.academicYear + 543} เทอม ${termInformation.semester}`}</p>
                                    </h2>
                                    <p className="text-sm text-text-color-alt font-body">{`${formatDateToThaiStyle(termInformation.termStart)} - ${formatDateToThaiStyle(termInformation.termEnd)}`}</p>
                                </div>
                            </div>
                            {/* <p className="bg-primary text-white font-normal rounded-xl shadow-lg w-fit px-4 py-1.5"> {formatDateToThaiStyle(termInformation.termStart)}</p> */}
                            <AddHoliday holidayList={holidayList} setHolidayList={setHolidayList} termStart={termInformation.termStart} termEnd={termInformation.termEnd} callApiAddHoliday={callApiAddHoliday} prevStep={prevStep} isSubmitting={isSubmitting} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CreateHoliday;
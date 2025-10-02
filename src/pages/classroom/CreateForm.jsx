import { set, useForm, Controller, useWatch } from "react-hook-form"
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import { validateNumber } from "../../regx.js";
import ErrorAlert from "../../components/alert/error.jsx";

function CreateClassroom() {
    const [error, setError] = useState(null);
    const [isMultipleMode, setIsMultipleMode] = useState(false);
    const [numberOfClassrooms, setNumberOfClassrooms] = useState(1);
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [studentOptions, setStudentOptions] = useState(null);
    const [classroomType, setClassroomType] = useState(null);
    const [academicterms, setAcademicTerms] = useState(null);
    const redirect = useNavigate();
    const [inputError, setInputError] = useState({});

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm();
    const selectedTerm = watch('termId');
    const selectedTeachersRef = useRef(new Set());

    const inputValidation = (classrooms, isMultipleMode) => {
        /*
        Example Class Data:
        {
            "classLevel": "2",                             // ระดับชั้น
            "classRoom": "12",                             // ห้องเรียน
            "classTypeId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // รหัสประเภทห้องเรียน (UUID ตัวอย่าง)
            "academicYear": 2025,                          // ปีการศึกษา
            "semester": 1,                                 // ภาคการศึกษา
            "termId": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy", // รหัสภาคเรียน (UUID ตัวอย่าง)
            "teacherIds": [                                // รายชื่อครูประจำชั้น (UUID ตัวอย่าง)
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            ],
            "leaderId": "00001"                            // รหัสหัวหน้าห้องตัวอย่าง
        }
        */

        const errorMessageFormat = (description, isMultipleMode, index) => {
            let title = "เกิดข้อผิดพลาด";
            let descriptionFormat = description;
            if (isMultipleMode) {
                title += `ที่ฟอร์มลำดับที่ ${index + 1}`
                return {
                    title: title,
                    description: descriptionFormat
                }
            } else {
                return {
                    title: title,
                    description: descriptionFormat
                }
            };

        };

        for (let index = 0; index < classrooms.length; index++) {
            const classroom = classrooms[index];
            // console.log(classroom["className"].length);
            for(let i = 0; i < classroom.classRoom.length ; i++) {
                let charAtClassname = classroom.classRoom[i];
                if(!validateNumber(charAtClassname)) {
                    const description = "กรุณากรอกเฉพาะหมายเลขที่ช่องกรองหมายเลขห้อง";
                    setInputError(errorMessageFormat(description, isMultipleMode, index));
                    console.log('ไม่ผ่าน ' + charAtClassname);
                    return false;
                }
            };
        };

        return true; // correct format

    };


    const onSubmit = async function (data) {
        try {
            let classrooms = [];
            if (isMultipleMode) {
                // Create an array of classroom data based on the number input
                for (let i = 0; i < numberOfClassrooms; i++) {
                    classrooms.push({
                        ...data[`classroom_${i}`]
                    });
                }
            } else {
                classrooms = [data];
            }
            console.log(classrooms);
            const validateInputStatus = inputValidation(classrooms, isMultipleMode); // Call inputValidation function.
            if (validateInputStatus === false) return; //if format not good for any input return; for stop this function.

            const responses = await Promise.all(
                classrooms.map(classroom =>
                    axios.post(`${HOSTNAME}/a/classroom`, classroom)
                )
            );

            if (responses.every(response => response.status === 200)) {
                redirect("/classroom",
                    { state: { message: "เพิ่มห้องเรียนเรียบร้อยแล้ว" } }
                );
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการสร้างห้องเรียน");
        }
    }

    function fetchAcademicTerms() {
        axios
            .get(HOSTNAME + "/a/academicterms")
            .then((response) => {
                setAcademicTerms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching academic terms", error);
            });
    }

    function fetchTeacher() {
        axios
            .get(HOSTNAME + "/a/teachers")
            .then((response) => {
                setTeacherOptions(response.data.map(t => ({
                    value: t.tchId,
                    label: `${t.fName} ${t.lName}`,
                    classTeacher: t.classTeacher    // include assignments
                })));
            })
            .catch((error) => {
                console.error("Error fetching teachers", error);
            });
    }

    function fetchStudent() {
        axios
            .get(HOSTNAME + "/a/students")
            .then((response) => {
                setStudentOptions(response.data
                    .map(s => ({
                        value: s.stdId,
                        label: `${s.fName} ${s.lName}`
                    })));

            })
            .catch((error) => {
                console.error("Error fetching students", error);
            });
    }

    function fetchClassroomType() {
        axios
            .get(HOSTNAME + "/a/classrooms/types")
            .then((response) => {
                setClassroomType(response.data);
            })
            .catch((error) => {
                console.error("Error fetching classroom types", error);
            });
    }

    useEffect(() => {
        fetchTeacher();
        fetchStudent();
        fetchClassroomType();
        fetchAcademicTerms();
    }
        , []);

    const handleTeacherChange = (selectedOptions, formIndex = null) => {
        const fieldName = formIndex !== null ? `classroom_${formIndex}.teacherIds` : "teacherIds";
        const previousTeachers = watch(fieldName) || [];
        const newTeacherIds = selectedOptions ? selectedOptions.map(option => option.value) : [];

        // Batch update selectedTeachersRef (no re-render)
        const newSet = new Set(selectedTeachersRef.current);
        previousTeachers.forEach(teacherId => newSet.delete(teacherId));
        newTeacherIds.forEach(teacherId => newSet.add(teacherId));
        selectedTeachersRef.current = newSet;

        setValue(fieldName, newTeacherIds, { shouldValidate: true, shouldDirty: true });
    };

    // เพิ่มการกำหนดค่าเริ่มต้นเมื่อสลับไปโหมดหลายห้องเรียน
    useEffect(() => {
        if (isMultipleMode) {
            // สร้างค่าเริ่มต้นสำหรับแต่ละห้องเรียนเมื่อสลับโหมด
            Array.from({ length: numberOfClassrooms }).forEach((_, index) => {
                // ตั้งค่าเริ่มต้นเพื่อให้ React Hook Form ติดตามแต่ละฟอร์ม
                setValue(`classroom_${index}.classLevel`, 1);
                setValue(`classroom_${index}.classRoom`, "");
                setValue(`classroom_${index}.teacherIds`, []);
            });
        }
    }, [isMultipleMode]);

    // เพิ่มการกำหนดค่าเริ่มต้นเมื่อเพิ่มจำนวนห้องเรียน (เฉพาะห้องใหม่)
    useEffect(() => {
        if (isMultipleMode && numberOfClassrooms > 1) {
            // ตั้งค่าเริ่มต้นสำหรับห้องเรียนใหม่ที่เพิ่มเข้ามา
            setValue(`classroom_${numberOfClassrooms - 1}.classLevel`, 1);
            setValue(`classroom_${numberOfClassrooms - 1}.classRoom`, "");
            setValue(`classroom_${numberOfClassrooms - 1}.teacherIds`, []);
        }
    }, [numberOfClassrooms, isMultipleMode]);

    const ClassroomForm = ({ index }) => {
        // ดึงค่าที่ต้องการแสดงผล
        const currentTeacherIds = useWatch({ control, name: `classroom_${index}.teacherIds` }) || [];
        const formTerm = useWatch({ control, name: `classroom_${index}.termId` });
        const classTypeOptions = classroomType?.map(ct => ({
            value: ct.classTypeId,
            label: `${ct.classTypeNameThai} (${ct.classTypeNameEng})`
        })) || [];

        // สร้างตัวเลือกสำหรับ select components
        const termOptions = academicterms?.map(term => ({
            value: term.termId,
            label: `ปีการศึกษา ${term.academicYear + 543} เทอม ${term.semester}`
        })) || [];

        return (
            <div className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                <div className="flex items-center mb-4">
                    <div className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm font-medium">
                        {index + 1}
                    </div>
                    <h3 className="text-text-color font-medium font-heading">ห้องเรียนที่ {index + 1}</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* ชั้นเรียน */}
                    <div className="space-y-2">
                        <label htmlFor={`ClassName_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            ชั้นมัธยมศึกษาปีที่ <span className="text-red-500">*</span>
                        </label>
                        <select
                            id={`ClassName_${index}`}
                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                            {...register(`classroom_${index}.classLevel`)}
                            required
                        >
                            <option value={1}>ม.1</option>
                            <option value={2}>ม.2</option>
                            <option value={3}>ม.3</option>
                            <option value={4}>ม.4</option>
                            <option value={5}>ม.5</option>
                            <option value={6}>ม.6</option>
                        </select>
                    </div>

                    {/* ห้อง */}
                    <div className="space-y-2">
                        <label htmlFor={`ClassRoom_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            ห้อง <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id={`ClassRoom_${index}`}
                            placeholder="กรอกหมายเลขห้อง"
                            className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                            {...register(`classroom_${index}.classRoom`)}
                            required
                        />
                    </div>

                    {/* ประเภทห้องเรียน */}
                    <div className="space-y-2">
                        <label htmlFor={`ClassType_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            ประเภทห้องเรียน
                        </label>
                        <Controller
                            control={control}
                            name={`classroom_${index}.classTypeId`}
                            render={({ field }) => (
                                <Select
                                    id={`ClassType_${index}`}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={classTypeOptions}
                                    value={classTypeOptions.find(opt => opt.value === field.value) || null}
                                    onChange={selectedOption => field.onChange(selectedOption ? selectedOption.value : null)}
                                    isClearable
                                    placeholder="เลือกประเภทห้องเรียน..."
                                    required
                                    noOptionsMessage={() => "ไม่พบข้อมูล"}
                                />
                            )}
                        />
                    </div>

                    {/* ภาคการศึกษา */}
                    <div className="space-y-2">
                        <label htmlFor={`AcademicTerm_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ภาคการศึกษา
                        </label>
                        <Controller
                            control={control}
                            name={`classroom_${index}.termId`}
                            render={({ field }) => (
                                <Select
                                    id={`AcademicTerm_${index}`}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={termOptions}
                                    value={termOptions.find(opt => opt.value === field.value) || null}
                                    onChange={selectedOption => {
                                        const term = academicterms?.find(t => t.termId === selectedOption?.value);
                                        if (term) {
                                            setValue(`classroom_${index}.academicYear`, term.academicYear);
                                            setValue(`classroom_${index}.semester`, term.semester);
                                            field.onChange(term.termId);
                                        } else {
                                            setValue(`classroom_${index}.academicYear`, null);
                                            setValue(`classroom_${index}.semester`, null);
                                            field.onChange(null);
                                        }
                                    }}
                                    isClearable
                                    required
                                    placeholder="เลือกภาคการศึกษา..."
                                    noOptionsMessage={() => "ไม่พบข้อมูล"}
                                />
                            )}
                        />
                    </div>

                    {/* ครูที่ปรึกษาประจำชั้น */}
                    <div className="space-y-2">
                        <label htmlFor={`ClassTeacher_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            ครูที่ปรึกษาประจำชั้น
                        </label>
                        <Controller
                            control={control}
                            name={`classroom_${index}.teacherIds`}
                            render={({ field }) => (
                                <Select
                                    id={`ClassTeacher_${index}`}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={teacherOptions?.filter(opt =>
                                        (
                                            !opt.classTeacher.some(ct => ct.classroom.termId === formTerm)
                                            || (field.value || []).includes(opt.value)
                                        )
                                        &&
                                        (
                                            !selectedTeachersRef.current.has(opt.value)
                                            || (field.value || []).includes(opt.value)
                                        )
                                    )}
                                    value={teacherOptions?.filter(option =>
                                        (field.value || []).includes(option.value)
                                    )}
                                    onChange={selectedOptions => {
                                        handleTeacherChange(selectedOptions, index);
                                    }}
                                    isClearable
                                    isMulti
                                    required
                                    placeholder="เลือกครูที่ปรึกษา..."
                                    noOptionsMessage={() => "ไม่พบข้อมูล"}
                                />
                            )}
                        />
                    </div>

                    {/* หัวหน้าห้อง */}
                    <div className="space-y-2">
                        <label htmlFor={`Leader_${index}`} className="text-sm font-medium text-text-color font-body flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            หัวหน้าห้อง
                        </label>
                        <Controller
                            control={control}
                            name={`classroom_${index}.leaderId`}
                            render={({ field }) => (
                                <Select
                                    id={`Leader_${index}`}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={studentOptions}
                                    value={studentOptions?.find(option => option.value === field.value) || null}
                                    onChange={selectedOption => field.onChange(selectedOption ? selectedOption.value : null)}
                                    isClearable
                                    placeholder="เลือกหัวหน้าห้อง..."
                                    noOptionsMessage={() => "ไม่พบข้อมูล"}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">เพิ่มห้องเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>

            {inputError.title && inputError.description && (
                // Onclick = {() => setInputError({})} mean dismiss alert.  
                <div className="mb-2" onClick={() => setInputError({})}>
                    <ErrorAlert title={inputError.title} message={inputError.description} />
                </div>

            )}

            <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    onChange={(e) => setIsMultipleMode(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </div>
                            <span className="text-text-color font-medium font-body">สร้างหลายห้องเรียน</span>
                        </label>

                        {isMultipleMode && (
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-sm text-text-color-alt font-body">จำนวนห้องเรียน:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfClassrooms(prev => Math.max(1, prev - 1))}
                                        className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input
                                        type="number"
                                        value={numberOfClassrooms}
                                        onChange={(e) => setNumberOfClassrooms(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-9 text-center rounded-md border-gray-300 shadow-sm text-sm font-body"
                                        min="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfClassrooms(prev => prev + 1)}
                                        className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {isMultipleMode ? (
                            <div className="space-y-6">
                                {Array.from({ length: numberOfClassrooms }).map((_, index) => (
                                    <ClassroomForm key={index} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="ClassName" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        ชั้นมัธยมศึกษาปีที่ <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="ClassName"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("classLevel")}
                                        required
                                    >
                                        <option value={1}>ม.1</option>
                                        <option value={2}>ม.2</option>
                                        <option value={3}>ม.3</option>
                                        <option value={4}>ม.4</option>
                                        <option value={5}>ม.5</option>
                                        <option value={6}>ม.6</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ClassRoom" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                        ห้อง <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="ClassRoom"
                                        placeholder="กรอกหมายเลขห้อง"
                                        className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                                        {...register("classRoom")}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ClassType" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        ประเภทห้องเรียน
                                    </label>
                                    <Select
                                        id="ClassType"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={classroomType?.map(ct => ({ value: ct.classTypeId, label: `${ct.classTypeNameThai} (${ct.classTypeNameEng})` })) || []}
                                        onChange={(selectedOption) => setValue("classTypeId", selectedOption ? selectedOption.value : null)}
                                        isClearable
                                        placeholder="เลือกประเภทห้องเรียน..."
                                        required
                                        noOptionsMessage={() => "ไม่พบข้อมูล"}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="AcademicTerm" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        ภาคการศึกษา
                                    </label>
                                    <Select
                                        id="AcademicTerm"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        required
                                        options={academicterms?.map(term => ({
                                            value: term.termId,
                                            label: `ปีการศึกษา ${term.academicYear + 543} เทอม ${term.semester}`
                                        })) || []}
                                        onChange={(selectedOption) => {
                                            const term = academicterms?.find(t => t.termId === selectedOption?.value);
                                            if (term) {
                                                setValue("academicYear", term.academicYear);
                                                setValue("semester", term.semester);
                                                setValue("termId", term.termId);
                                            }
                                        }}
                                        isClearable
                                        placeholder="เลือกภาคการศึกษา..."
                                        noOptionsMessage={() => "ไม่พบข้อมูล"}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="ClassTeacher" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        ครูที่ปรึกษาประจำชั้น
                                    </label>
                                    <Select
                                        id="ClassTeacher"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        required
                                        options={teacherOptions?.filter(opt =>
                                            // allow if not already advising for this term or already selected
                                            (
                                                !opt.classTeacher.some(ct => ct.classroom.termId === selectedTerm)
                                                || (watch('teacherIds') || []).includes(opt.value)
                                            )
                                            &&
                                            // prevent selection by other forms unless already selected here
                                            (
                                                !selectedTeachersRef.current.has(opt.value)
                                                || (watch('teacherIds') || []).includes(opt.value)
                                            )
                                        )}
                                        value={teacherOptions?.filter(option =>
                                            (watch('teacherIds') || []).includes(option.value)
                                        )}
                                        onChange={(selectedOptions) => handleTeacherChange(selectedOptions)}
                                        isClearable
                                        isMulti
                                        placeholder="เลือกครูที่ปรึกษา..."
                                        noOptionsMessage={() => "ไม่พบข้อมูล"}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="Leader" className="text-sm font-medium text-text-color font-body flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        หัวหน้าห้อง
                                    </label>
                                    <Select
                                        id="Leader"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={studentOptions}
                                        onChange={(selectedOption) => setValue("leaderId", selectedOption ? selectedOption.value : null)}
                                        isClearable
                                        placeholder="เลือกหัวหน้าห้อง..."
                                        noOptionsMessage={() => "ไม่พบข้อมูล"}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
                            <Link
                                to="/classroom"
                                className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                ยกเลิก
                            </Link>

                            <button
                                type="submit"
                                className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {isMultipleMode ? "บันทึกห้องเรียน" : "บันทึก"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateClassroom;
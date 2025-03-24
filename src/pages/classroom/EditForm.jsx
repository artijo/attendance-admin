import { set, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import Select from "react-select";

function EditClassroom() {
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [leaderOptions, setLeaderOptions] = useState(null);
    const [classroomType, setClassroomType] = useState(null);
    const [academicterms, setAcademicTerms] = useState(null);
    const redirect = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const onSubmit = async function (data) {
        try {
            const response = await axios.put(`${HOSTNAME}/a/classroom`, { ...data, classId:id });
            if (response.status === 200) {
                redirect("/classroom/"+id,
                    {state: {message: "แก้ไขห้องเรียนเรียบร้อยแล้ว"}}
                );
            }
        } catch (error) {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการแก้ไขห้องเรียน");
        }
    }

    function fetchTeacher() {
        axios
            .get(HOSTNAME + "/a/teachers")
            .then((response) => {
                setTeacherOptions(response.data
                    .filter(t => !t.classId) // Filter out teachers with classId
                    .map(t => ({
                        value: t.tchId,
                        label: `${t.fName} ${t.lName}`
                    }))
                );
            })
            .catch((error) => {
                console.error("Error fetching teachers", error);
            });
    }

    function fetchLeader() {
        axios
            .get(HOSTNAME + "/a/leaders")
            .then((response) => {
                setLeaderOptions(response.data
                    .filter(l => !l.classroom.some(c => c.leaderId === l.ldrId)) // Filter out leaders with classroom assignments
                    .map(l => ({
                        value: l.ldrId,
                        label: `${l.fName} ${l.lName}`
                    }))
                );
            })
            .catch((error) => {
                console.error("Error fetching leaders", error);
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

    function fetchClassroom() {
        axios
            .get(`${HOSTNAME}/a/classroom/${id}`)
            .then((response) => {
                const classroom = response.data;
                // Set form values
                setValue("classLevel", classroom.classLevel);
                setValue("classRoom", classroom.classRoom);
                setValue("classTypeId", classroom.classroomType?.classTypeId);
                setValue("teacherIds", classroom.teacher?.map(t => t.tchId));
                setValue("leaderId", classroom.leader?.ldrId);

                // Set term related values
                if (classroom.term) {
                    setValue("termId", classroom.term.termId);
                    setValue("academicYear", classroom.term.academicYear);
                    setValue("semester", classroom.term.semester);
                }

                // If teacher exists in classroom, add them to teacherOptions
                if (classroom.teacher?.length > 0) {
                    setTeacherOptions(prev => [
                        ...(prev || []),
                        ...classroom.teacher.map(t => ({
                            value: t.tchId,
                            label: `${t.fName} ${t.lName}`
                        }))
                    ]);
                }

                // If leader exists in classroom, add them to leaderOptions
                if (classroom.leader) {
                    setLeaderOptions(prev => [
                        ...(prev || []),
                        {
                            value: classroom.leader.ldrId,
                            label: `${classroom.leader.fName} ${classroom.leader.lName}`
                        }
                    ]);
                }
            })
            .catch((error) => {
                console.error("Error fetching classroom", error);
            });
    }

    useEffect(() => {
        fetchTeacher();
        fetchLeader();
        fetchClassroomType();
        fetchAcademicTerms();
        fetchClassroom();
    }, []);

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">แก้ไขข้อมูลห้องเรียน</h1>
                <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            
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
                    
                    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
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
                                value={classroomType?.find(ct => ct.classTypeId === watch('classTypeId'))
                                    ? { 
                                        value: watch('classTypeId'), 
                                        label: `${classroomType.find(ct => ct.classTypeId === watch('classTypeId')).classTypeNameThai} (${classroomType.find(ct => ct.classTypeId === watch('classTypeId')).classTypeNameEng})`
                                      }
                                    : null}
                                onChange={(selectedOption) => setValue("classTypeId", selectedOption ? selectedOption.value : null)}
                                isClearable
                                placeholder="เลือกประเภทห้องเรียน..."
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
                                options={academicterms?.map(term => ({
                                    value: term.termId,
                                    label: `ปีการศึกษา ${term.academicYear + 543} เทอม ${term.semester}`
                                })) || []}
                                value={academicterms?.map(term => ({
                                    value: term.termId,
                                    label: `ปีการศึกษา ${term.academicYear + 543} เทอม ${term.semester}`
                                })).find(option => 
                                    academicterms?.find(t => t.termId === watch('termId'))?.termId === option.value
                                )}
                                onChange={(selectedOption) => {
                                    const term = academicterms?.find(t => t.termId === selectedOption?.value);
                                    if (term) {
                                        setValue("termId", term.termId);
                                        setValue("academicYear", term.academicYear);
                                        setValue("semester", term.semester);
                                    } else {
                                        setValue("termId", null);
                                        setValue("academicYear", null);
                                        setValue("semester", null);
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
                                options={teacherOptions}
                                value={teacherOptions?.filter(option => 
                                    watch('teacherIds')?.includes(option.value)
                                )}
                                onChange={(selectedOptions) => setValue("teacherIds", selectedOptions ? selectedOptions.map(option => option.value) : [])}
                                isClearable
                                isMulti
                                placeholder="เลือกครูที่ปรึกษา..."
                                noOptionsMessage={() => "ไม่พบข้อมูล"}
                            />
                        </div>

                        {/* <div className="space-y-2">
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
                                options={leaderOptions}
                                value={leaderOptions?.find(option => option.value === watch('leaderId'))}
                                onChange={(selectedOption) => setValue("leaderId", selectedOption ? selectedOption.value : null)}
                                isClearable
                                placeholder="เลือกหัวหน้าห้อง..."
                                noOptionsMessage={() => "ไม่พบข้อมูล"}
                            />
                        </div> */}

                        <div className="sm:col-span-2 flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                            <Link 
                                to={`/classroom/${id}`}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                บันทึกการแก้ไข
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditClassroom;
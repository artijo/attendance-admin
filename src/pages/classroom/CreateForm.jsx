import { set, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
function CreateClassroom() {
    const [error, setError] = useState(null);
    const [isMultipleMode, setIsMultipleMode] = useState(false);
    const [numberOfClassrooms, setNumberOfClassrooms] = useState(1);
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [leaderOptions, setLeaderOptions] = useState(null);
    const [classroomType, setClassroomType] = useState(null);
    const [selectedTeachers, setSelectedTeachers] = useState(new Set());
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

            const responses = await Promise.all(
                classrooms.map(classroom => 
                    axios.post(`${HOSTNAME}/a/classroom`, classroom)
                )
            );

            if (responses.every(response => response.status === 200)) {
                redirect("/classroom",
                    {state: {message: "เพิ่มห้องเรียนเรียบร้อยแล้ว"}}
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
                setTeacherOptions(response.data
                    .filter(t => t.classId === null)
                    .map(t => ({
                    value: t.tchId,
                    label: `${t.fName} ${t.lName}`
                })));
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
                    // .filter(l => !l.classroom)
                    .map(l => ({
                    value: l.ldrId,
                    label: `${l.fName} ${l.lName}`
                })));
                
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

    useEffect(() => {
        fetchTeacher();
        fetchLeader();
        fetchClassroomType();
        fetchAcademicTerms();
    }
    , []);

    const handleTeacherChange = (selectedOptions, formIndex = null) => {
        const fieldName = formIndex !== null ? `classroom_${formIndex}.teacherIds` : "teacherIds";
        
        // Get previously selected teachers for this form
        const previousTeachers = watch(fieldName) || [];
        
        // Remove previous selections from the global set
        previousTeachers.forEach(teacherId => {
            setSelectedTeachers(prev => {
                const newSet = new Set(prev);
                newSet.delete(teacherId);
                return newSet;
            });
        });

        // Add new selections to the global set
        const newTeacherIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        newTeacherIds.forEach(teacherId => {
            setSelectedTeachers(prev => new Set([...prev, teacherId]));
        });

        // Update form value
        setValue(fieldName, newTeacherIds);
    };

    const ClassroomForm = ({ index }) => {
        const currentTeacherIds = watch(`classroom_${index}.teacherIds`) || [];
        
        return (
            <div className="border p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-4">ห้องเรียนที่ {index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Existing form fields with modified register names */}
                    <div>
                        <label htmlFor={`ClassName_${index}`} className="block text-xs font-medium text-gray-700">ชั้นมัธยมศึกษาปีที่</label>
                        <select
                            id={`ClassName_${index}`}
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register(`classroom_${index}.classLevel`)}
                        >
                            <option value={1}>ม.1</option>
                            <option value={2}>ม.2</option>
                            <option value={3}>ม.3</option>
                            <option value={4}>ม.4</option>
                            <option value={5}>ม.5</option>
                            <option value={6}>ม.6</option>
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor={`ClassRoom_${index}`} className="block text-xs font-medium text-gray-700">ห้อง</label>
                        <input
                            type="text"
                            id={`ClassRoom_${index}`}
                            placeholder="xx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register(`classroom_${index}.classRoom`)}
                        />
                    </div>

                    <div>
                        <label htmlFor={`ClassType_${index}`} className="block text-xs font-medium text-gray-700"> ประเภทห้องเรียน</label>
                        <Select
                            id={`ClassType_${index}`}
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={classroomType?.map(ct => ({ value: ct.classTypeId, label: `${ct.classTypeNameThai} (${ct.classTypeNameEng})` })) || []}
                            {...register(`classroom_${index}.classTypeId`)}
                            onChange={(selectedOption) => setValue(`classroom_${index}.classTypeId`, selectedOption ? selectedOption.value : null)}
                            isClearable
                        />
                    </div>
                    <div>
                        <label htmlFor={`AcademicTerm_${index}`} className="block text-xs font-medium text-gray-700">ภาคการศึกษา</label>
                        <Select
                            id={`AcademicTerm_${index}`}
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={academicterms?.map(term => ({
                                value: term.termId,
                                label: `ปีการศึกษา ${term.academicYear+543} เทอม ${term.semester}`
                            })) || []}
                            onChange={(selectedOption) => {
                                const term = academicterms?.find(t => t.termId === selectedOption?.value);
                                if (term) {
                                    setValue(`classroom_${index}.academicYear`, term.academicYear);
                                    setValue(`classroom_${index}.semester`, term.semester);
                                    setValue(`classroom_${index}.termId`, term.termId);
                                }
                            }}
                            isClearable
                        />
                    </div>

                    <div>
                        <label htmlFor={`ClassTeacher_${index}`} className="block text-xs font-medium text-gray-700">ครูที่ปรึกษาประจำชั้น</label>
                        <Select
                            id={`ClassTeacher_${index}`}
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={teacherOptions?.filter(teacher => 
                                !selectedTeachers.has(teacher.value) || currentTeacherIds.includes(teacher.value)
                            )}
                            value={teacherOptions?.filter(option => 
                                currentTeacherIds.includes(option.value)
                            )}
                            onChange={(selectedOptions) => handleTeacherChange(selectedOptions, index)}
                            isClearable
                            isMulti
                        />
                    </div>
                    
                    <div>
                        <label htmlFor={`Leader_${index}`} className="block text-xs font-medium text-gray-700">หัวหน้าห้อง</label>
                        <Select
                            id={`Leader_${index}`}
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={leaderOptions}
                            {...register(`classroom_${index}.leaderId`)}
                            onChange={(selectedOption) => setValue(`classroom_${index}.leaderId`, selectedOption ? selectedOption.value : null)}
                            isClearable
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="font-bold text-center">เพิ่มห้องเรียน</h1>
            <div className="mt-5 p-4 bg-white border shadow-sm sm:rounded-sm">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                <div className="mb-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                            className="sr-only peer"
                            onChange={(e) => setIsMultipleMode(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">สร้างหลายห้องเรียน</span>
                    </label>
                </div>

                {isMultipleMode && (
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700">จำนวนห้องเรียน</label>
                        <div className="flex items-center gap-2">
                            <button 
                                type="button" 
                                onClick={() => setNumberOfClassrooms(prev => Math.max(1, prev - 1))}
                                className="px-3 py-1 border rounded-md"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={numberOfClassrooms}
                                onChange={(e) => setNumberOfClassrooms(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 h-8 text-center rounded-md border-gray-200 shadow-sm sm:text-sm"
                                min="1"
                            />
                            <button 
                                type="button"
                                onClick={() => setNumberOfClassrooms(prev => prev + 1)}
                                className="px-3 py-1 border rounded-md"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {isMultipleMode ? (
                        Array.from({ length: numberOfClassrooms }).map((_, index) => (
                            <ClassroomForm key={index} index={index} />
                        ))
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="ClassName" className="block text-xs font-medium text-gray-700">ชั้นมัธยมศึกษาปีที่</label>
                                <select
                                    id="ClassName"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
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
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="ClassRoom" className="block text-xs font-medium text-gray-700">
                                        ห้อง
                                    </label>
                                    <input
                                        type="text"
                                        id="ClassRoom"
                                        placeholder="xx"
                                        className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                        {...register("classRoom")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="ClassType" className="block text-xs font-medium text-gray-700"> ประเภทห้องเรียน</label>
                                <Select
                                    id="ClassType"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    options={classroomType?.map(ct => ({ value: ct.classTypeId, label: `${ct.classTypeNameThai} (${ct.classTypeNameEng})` })) || []}
                                    {...register("classTypeId")}
                                    onChange={(selectedOption) => setValue("classTypeId", selectedOption ? selectedOption.value : null)}
                                    isClearable
                                />
                            </div>
                            <div>
                                <label htmlFor="AcademicTerm" className="block text-xs font-medium text-gray-700">ภาคการศึกษา</label>
                                <Select
                                    id="AcademicTerm"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    options={academicterms?.map(term => ({
                                        value: term.termId,
                                        label: `ปีการศึกษา ${term.academicYear+543} เทอม ${term.semester}`
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
                                />
                            </div>
                            <div>
                                <label htmlFor="ClassTeacher" className="block text-xs font-medium text-gray-700">ครูที่ปรึกษาประจำชั้น</label>
                                <Select
                                    id="ClassTeacher"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    options={teacherOptions?.filter(teacher => 
                                        !selectedTeachers.has(teacher.value) || 
                                        (watch('teacherIds') || []).includes(teacher.value)
                                    )}
                                    value={teacherOptions?.filter(option => 
                                        (watch('teacherIds') || []).includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => handleTeacherChange(selectedOptions)}
                                    isClearable
                                    isMulti
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="Leader" className="block text-xs font-medium text-gray-700">หัวหน้าห้อง</label>
                                <Select
                                    id="Leader"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    options={leaderOptions}
                                    {...register("leaderId")}
                                    onChange={(selectedOption) => setValue("leaderId", selectedOption ? selectedOption.value : null)}
                                    isClearable
                                />
                            </div>
                        </div>
                    )}
                    
                    <button 
                        type="submit"
                        className="flex mt-5 justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isMultipleMode ? "บันทึกห้องเรียน" : "บันทึก"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateClassroom;
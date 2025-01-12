import { set, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
function EditClassroom() {
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [leaderOptions, setLeaderOptions] = useState(null);
    const [classroomType, setClassroomType] = useState(null);
    const [academicterms, setAcademicTerms] = useState(null);
    const redirect = useNavigate();

    // const teacherOptions = teacher?.map(t => ({
    //     value: t.tchId,
    //     label: `${t.fName} ${t.lName}`
    // }));

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
        <div>
            <h1>ฟอร์มแก้ไขห้องเรียน</h1>
            <div className="mt-5 p-4 bg-white shadow sm:rounded-lg">
                {error && <div className="text-red-500">{error}</div>}
                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
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
                    
                    <div>
                        <label htmlFor="ClassRoom" className="block text-xs font-medium text-gray-700"> ห้อง</label>
                        <input
                            type="text"
                            id="ClassRoom"
                            placeholder="xx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            {...register("classRoom")}
                        />
                    </div>
                    <div>
                        <label htmlFor="ClassType" className="block text-xs font-medium text-gray-700"> ประเภทห้องเรียน</label>
                        <Select
                            id="ClassType"
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={classroomType?.map(ct => ({ value: ct.classTypeId, label: `${ct.classTypeNameThai} (${ct.classTypeNameEng})` })) || []}
                            value={classroomType?.find(ct => ct.classTypeId === watch('classTypeId'))
                                ? { 
                                    value: watch('classTypeId'), 
                                    label: `${classroomType.find(ct => ct.classTypeId === watch('classTypeId')).classTypeNameThai} (${classroomType.find(ct => ct.classTypeId === watch('classTypeId')).classTypeNameEng})`
                                  }
                                : null}
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
                        />
                    </div>
                    <div>
                        <label htmlFor="ClassTeacher" className="block text-xs font-medium text-gray-700">ครูที่ปรึกษาประจำชั้น</label>
                        <Select
                            id="ClassTeacher"
                            className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            options={teacherOptions}
                            value={teacherOptions?.filter(option => 
                                watch('teacherIds')?.includes(option.value)
                            )}
                            onChange={(selectedOptions) => setValue("teacherIds", selectedOptions ? selectedOptions.map(option => option.value) : [])}
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
                            value={leaderOptions?.find(option => option.value === watch('leaderId'))}
                            onChange={(selectedOption) => setValue("leaderId", selectedOption ? selectedOption.value : null)}
                            isClearable
                        />
                    </div>
                    <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">บันทึก</button>
                </form>
            </div>
        </div>
    )
}

export default EditClassroom;
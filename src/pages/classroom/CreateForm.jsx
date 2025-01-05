import { set, useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSTNAME } from "../../config.js";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
function CreateClassroom() {
    const [error, setError] = useState(null);
    const [isRangeMode, setIsRangeMode] = useState(false);
    const [teacherOptions, setTeacherOptions] = useState(null);
    const [leaderOptions, setLeaderOptions] = useState(null);
    const [classroomType, setClassroomType] = useState(null);
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
            if (isRangeMode && data.endRoom) {
                const startRoom = parseInt(data.classRoom);
                const endRoom = parseInt(data.endRoom);
                
                for (let room = startRoom; room <= endRoom; room++) {
                    classrooms.push({
                        ...data,
                        classRoom: room.toString()
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

    function fetchTeacher() {
        axios
            .get(HOSTNAME + "/a/teachers")
            .then((response) => {
                setTeacherOptions(response.data.map(t => ({
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
                setLeaderOptions(response.data.map(l => ({
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
                console.log(response);
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
    }
    , []);
    return (
        <div>
            <h1>ฟอร์มเพิ่มห้องเรียนใหม่</h1>
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
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="ClassRoom" className="block text-xs font-medium text-gray-700">
                                {isRangeMode ? "ห้องเริ่มต้น" : "ห้อง"}
                            </label>
                            <input
                                type="text"
                                id="ClassRoom"
                                placeholder="xx"
                                className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                {...register("classRoom")}
                            />
                        </div>
                        {isRangeMode && (
                            <div className="flex-1">
                                <label htmlFor="EndRoom" className="block text-xs font-medium text-gray-700">ห้องสุดท้าย</label>
                                <input
                                    type="text"
                                    id="EndRoom"
                                    placeholder="xx"
                                    className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    {...register("endRoom")}
                                />
                            </div>
                        )}
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
                        <label htmlFor="ClassYear" className="block text-xs font-medium text-gray-700"> ปีการศึกษา (ค.ศ.)</label>
                        <input
                            type="number"
                            id="ClassYear"
                            placeholder="xxxx"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            min={new Date().getFullYear()}
                            {...register("academicYear")}
                        />
                    </div>
                    <div>
                        <label htmlFor="Semester" className="block text-xs font-medium text-gray-700">เทอมที่</label>
                        <input
                            type="number"
                            id="Semester"
                            placeholder="x"
                            className="mt-1 w-full h-8 rounded-md border-gray-200 shadow-sm sm:text-sm"
                            min={1}
                            max={2}
                            {...register("semester")}
                        />
                    </div>
                    {!isRangeMode && (
                        <>
                    <div>
                    <label htmlFor="ClassTeacher" className="block text-xs font-medium text-gray-700">ครูที่ปรึกษาประจำชั้น</label>
                    <Select
                id="ClassTeacher"
                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                options={teacherOptions}
                {...register("teacherIds")}
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
                            {...register("leaderId")}
                            onChange={(selectedOption) => setValue("leaderId", selectedOption ? selectedOption.value : null)}
                            isClearable
                        />
                    </div>
                    </>
                    ) }
                    <div className="sm:col-span-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" 
                                className="sr-only peer"
                                onChange={(e) => setIsRangeMode(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">สร้างหลายห้องเรียน</span>
                        </label>
                    </div>
                    <button type="submit" className="block w-fit ml-auto text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">บันทึก</button>
                </form>
            </div>
        </div>
    )
}

export default CreateClassroom;
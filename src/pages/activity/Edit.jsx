import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

function EditActivity() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activityTypes, setActivityTypes] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, control, watch, reset } = useForm({
        defaultValues: {
            actName: "",
            actDate: "",
            actDateEnd: "",
            actTypeId: "",
            actDesc: "",
            actLocation: "",
            actStartTime: "",
            actEndTime: "",
            joinLimit: false,
            teachers: [],
            classrooms: []
        }
    });

    const joinLimit = watch("joinLimit");

    useEffect(() => {
        // Fetch activity data
        axios.get(HOSTNAME + "/a/activity/" + id)
            .then(response => {
                const activity = response.data;
                
                // Format dates
                const startDate = new Date(activity.actDate).toISOString().split('T')[0];
                const endDate = new Date(activity.actDateEnd).toISOString().split('T')[0];

                // Reset form with properly formatted dates and original time strings
                reset({
                    actName: activity.actName,
                    actDate: startDate,
                    actDateEnd: endDate,
                    actTypeId: {
                        value: activity.activityType.actTypeId,
                        label: activity.activityType.actTypeName
                    },
                    actDesc: activity.actDesc,
                    actLocation: activity.actLocation,
                    // ใช้ค่าเวลาจากฐานข้อมูลโดยตรง เนื่องจากอยู่ในรูปแบบ HH:mm อยู่แล้ว
                    actStartTime: activity.actStartTime,
                    actEndTime: activity.actEndTime,
                    joinLimit: activity.joinLimit,
                    teachers: activity.teacher.map(t => ({
                        value: t.teacher.tchId,
                        label: `${t.teacher.tchCode} - ${t.teacher.fName} ${t.teacher.lName}`
                    })),
                    classrooms: activity.classroom ? activity.classroom.map(c => ({
                        value: c.classroom.classId,
                        label: `${c.classroom.classLevel}/${c.classroom.classRoom}`
                    })) : []
                });
                setIsLoading(false);
            })
            .catch(error => console.error("Error fetching activity:", error));

        // Fetch supporting data
        Promise.all([
            axios.get(HOSTNAME + "/a/activityType"),
            axios.get(HOSTNAME + "/a/teachers"),
            axios.get(HOSTNAME + "/a/classrooms")
        ]).then(([actTypes, teachersList, classroomsList]) => {
            setActivityTypes(actTypes.data.map(type => ({
                value: type.actTypeId,
                label: type.actTypeName
            })));
            setTeachers(teachersList.data.map(teacher => ({
                value: teacher.tchId,
                label: `${teacher.tchCode} - ${teacher.fName} ${teacher.lName}`
            })));
            setClassrooms(classroomsList.data.map(classroom => ({
                value: classroom.classId,
                label: `${classroom.classLevel}/${classroom.classRoom} - ${classroom.classroomType.classTypeNameThai}`
            })));
        }).catch(error => console.error("Error fetching data:", error));
    }, [id, reset]);

    const onSubmit = (data) => {
        const activityData = {
            actName: data.actName,
            actDate: data.actDate,
            actDateEnd: data.actDateEnd,
            actTypeId: data.actTypeId.value,
            actDesc: data.actDesc,
            actLocation: data.actLocation,
            actStartTime: data.actStartTime,
            actEndTime: data.actEndTime,
            joinLimit: data.joinLimit,
            teacher: data.teachers.map(t => ({ tchId: t.value })),
            actParticipate: data.joinLimit ? data.classrooms.map(c => ({ classId: c.value })) : []
        };

        axios.put(HOSTNAME + "/a/activity/" + id, activityData)
            .then(() => {
                navigate(`/activity/${id}`, { 
                    state: { message: "แก้ไขข้อมูลกิจกรรมเรียบร้อยแล้ว" } 
                });
            })
            .catch(error => console.error("Error updating activity:", error));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>แก้ไขกิจกรรม</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                <div className="space-y-6">
                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* Activity Name */}
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    ชื่อกิจกรรม
                                </label>
                                <input
                                    type="text"
                                    {...register("actName", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Activity Description */}
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    รายละเอียดกิจกรรม
                                </label>
                                <textarea
                                    {...register("actDesc", { required: true })}
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Activity Location */}
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    สถานที่จัดกิจกรรม
                                </label>
                                <input
                                    type="text"
                                    {...register("actLocation", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Activity Type Select */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    ประเภทกิจกรรม
                                </label>
                                <Controller
                                    name="actTypeId"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={activityTypes}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="เลือกประเภทกิจกรรม"
                                        />
                                    )}
                                />
                            </div>

                            {/* Activity Start Date */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    วันที่เริ่มกิจกรรม
                                </label>
                                <input
                                    type="date"
                                    {...register("actDate", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Activity End Date */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    วันที่สิ้นสุดกิจกรรม
                                </label>
                                <input
                                    type="date"
                                    {...register("actDateEnd", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Start Time */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    เวลาเริ่มกิจกรรม
                                </label>
                                <input
                                    type="time"
                                    {...register("actStartTime", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* End Time */}
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    เวลาสิ้นสุดกิจกรรม
                                </label>
                                <input
                                    type="time"
                                    {...register("actEndTime", { required: true })}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {/* Join Limit Toggle Switch */}
                            <div className="sm:col-span-full">
                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("joinLimit")}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            จำกัดการเข้าร่วมกิจกรรม
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Classroom Multi-Select (Conditional) */}
                            {joinLimit && (
                                <div className="sm:col-span-full">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                        ห้องเรียนที่สามารถเข้าร่วมได้
                                    </label>
                                    <Controller
                                        name="classrooms"
                                        control={control}
                                        rules={{ required: joinLimit }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={classrooms}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="เลือกห้องเรียน"
                                            />
                                        )}
                                    />
                                </div>
                            )}

                            {/* Teachers Multi-Select */}
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    ครูผู้ดูแลกิจกรรม
                                </label>
                                <Controller
                                    name="teachers"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isMulti
                                            options={teachers}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="เลือกครูผู้ดูแล"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditActivity;

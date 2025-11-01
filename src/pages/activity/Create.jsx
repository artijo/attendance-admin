import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { HOSTNAME } from "../../config";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { validateActivity } from "../../validator.js";
import ErrorAlert from "../../components/alert/error.jsx";

function CreateActivity() {
  const navigate = useNavigate();
  const [activityTypes, setActivityTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTeachersSelected, setAllTeachersSelected] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [inputError, setInputError] = useState({});

  const { register, handleSubmit, control, watch, setValue } = useForm({
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
      joinLimitType: "classroom",
      joinLimitNumber: "",
      teachers: [],
      classrooms: [],
    },
  });

  const joinLimit = watch("joinLimit");
  const joinLimitType = watch("joinLimitType");

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get(HOSTNAME + "/a/activityType"),
      axios.get(HOSTNAME + "/a/teachers"),
      axios.get(HOSTNAME + "/a/classrooms"),
    ])
      .then(([actTypes, teachersList, classroomsList]) => {
        setActivityTypes(
          actTypes.data.map((type) => ({
            value: type.actTypeId,
            label: type.actTypeName,
          }))
        );

        setTeachers(
          teachersList.data.map((teacher) => ({
            value: teacher.tchId,
            label: `${teacher.fName} ${teacher.lName}`,
          }))
        );

        setClassrooms(
          classroomsList.data.map((classroom) => ({
            value: classroom.classId,
            label: `ม.${classroom.classLevel}/${classroom.classRoom} - ${
              classroom.classroomType.classTypeNameThai
            } (ปีการศึกษา ${classroom.term.academicYear + 543})`,
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // Add a function to handle "select all teachers" checkbox
  const handleSelectAllTeachers = (e) => {
    if (e.target.checked) {
      setAllTeachersSelected(true);
      setValue("teachers", []);
    } else {
      setValue("teachers", []);
      setAllTeachersSelected(false);
    }
  };

  const onSubmit = (data) => {
    // Prepare validation data
    const validationData = {
      actName: data.actName,
      actDate: data.actDate,
      actDateEnd: data.actDateEnd,
      actTypeId: data.actTypeId,
      actDesc: data.actDesc,
      actLocation: data.actLocation,
      actStartTime: data.actStartTime,
      actEndTime: data.actEndTime,
      joinLimit: data.joinLimit,
      joinLimitType: data.joinLimitType,
      joinLimitNumber:
        data.joinLimitType === "number" ? parseInt(data.joinLimitNumber) : null,
      teachers: data.teachers || [],
      teacherAll: allTeachersSelected,
      classrooms: data.classrooms || [],
    };

    // Validate using Yup
    const validation = validateActivity(validationData);

    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setInputError({
        title: "เกิดข้อผิดพลาด",
        description: firstError,
      });
      setValidationErrors(validation.errors);
      return;
    }

    // Clear validation errors
    setValidationErrors({});
    setInputError({});

    // Prepare activity data for API
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
      joinLimitType: data.joinLimitType,
      joinLimitNumber:
        data.joinLimitType === "number" ? parseInt(data.joinLimitNumber) : null,
      teacher: allTeachersSelected
        ? teachers.map((t) => ({ tchId: t.value }))
        : data.teachers.map((t) => ({ tchId: t.value })),
      teacherAll: allTeachersSelected,
      actParticipate:
        data.joinLimit && data.joinLimitType === "classroom"
          ? data.classrooms.map((c) => ({ classId: c.value }))
          : [],
    };

    axios
      .post(HOSTNAME + "/a/activity", activityData)
      .then(() => {
        navigate("/activities", {
          state: { message: "เพิ่มกิจกรรมเรียบร้อยแล้ว" },
        });
      })
      .catch((error) => {
        console.error("Error creating activity:", error);
        setInputError({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถเพิ่มกิจกรรมได้ กรุณาลองใหม่อีกครั้ง",
        });
      });
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#e5e7eb",
      borderRadius: "0.5rem",
      minHeight: "42px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">
          เพิ่มกิจกรรมใหม่
        </h1>
        <div className="mt-2 h-1 w-16 bg-secondary rounded-full"></div>
      </div>

      {inputError.title && inputError.description && (
        <div className="mb-6" onClick={() => setInputError({})}>
          <ErrorAlert
            title={inputError.title}
            message={inputError.description}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-line overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-text-color font-heading mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ข้อมูลทั่วไป
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Activity Name */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      ชื่อกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("actName")}
                      className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                        validationErrors.actName ? "border-red-500" : ""
                      }`}
                      placeholder="ระบุชื่อกิจกรรม"
                      onChange={(e) => {
                        register("actName").onChange(e);
                        if (validationErrors.actName) {
                          setValidationErrors({
                            ...validationErrors,
                            actName: "",
                          });
                        }
                      }}
                    />
                    {validationErrors.actName && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {validationErrors.actName}
                      </p>
                    )}
                  </div>

                  {/* Activity Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      ประเภทกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="actTypeId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={activityTypes}
                          styles={customSelectStyles}
                          placeholder="เลือกประเภทกิจกรรม"
                          className={`font-body ${
                            validationErrors.actTypeId ? "border-red-500" : ""
                          }`}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption);
                            if (validationErrors.actTypeId) {
                              setValidationErrors({
                                ...validationErrors,
                                actTypeId: "",
                              });
                            }
                          }}
                        />
                      )}
                    />
                    {validationErrors.actTypeId && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {validationErrors.actTypeId}
                      </p>
                    )}
                  </div>

                  {/* Activity Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      สถานที่จัดกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("actLocation")}
                      className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                        validationErrors.actLocation ? "border-red-500" : ""
                      }`}
                      placeholder="ระบุสถานที่จัดกิจกรรม"
                      onChange={(e) => {
                        register("actLocation").onChange(e);
                        if (validationErrors.actLocation) {
                          setValidationErrors({
                            ...validationErrors,
                            actLocation: "",
                          });
                        }
                      }}
                    />
                    {validationErrors.actLocation && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {validationErrors.actLocation}
                      </p>
                    )}
                  </div>

                  {/* Activity Description */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      รายละเอียดกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("actDesc")}
                      rows={3}
                      className={`w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color ${
                        validationErrors.actDesc ? "border-red-500" : ""
                      }`}
                      placeholder="อธิบายรายละเอียดของกิจกรรม"
                      onChange={(e) => {
                        register("actDesc").onChange(e);
                        if (validationErrors.actDesc) {
                          setValidationErrors({
                            ...validationErrors,
                            actDesc: "",
                          });
                        }
                      }}
                    />
                    {validationErrors.actDesc && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {validationErrors.actDesc}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date and Time Section */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-text-color font-heading mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  วันและเวลา
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      วันที่เริ่มกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      {...register("actDate", { required: true })}
                      className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      วันที่สิ้นสุดกิจกรรม{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("actDateEnd", { required: true })}
                      min={watch("actDate")}
                      required
                      disabled={watch("actDate") === ""}
                      className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      เวลาเริ่มกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("actStartTime", { required: true })}
                      className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                      required
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-color font-body flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      เวลาสิ้นสุดกิจกรรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("actEndTime", { required: true })}
                      min={watch("actStartTime")}
                      disabled={watch("actStartTime") === ""}
                      className="w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Participation Section */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-text-color font-heading mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  การเข้าร่วมกิจกรรม
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Teachers Multi-Select */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-text-color font-body flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        ครูผู้ดูแลกิจกรรม{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allTeachersSelected}
                          onChange={handleSelectAllTeachers}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-medium text-text-color font-body">
                          เลือกครูทั้งหมด
                        </span>
                      </label>
                    </div>

                    {!allTeachersSelected && (
                      <Controller
                        name="teachers"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isMulti
                            options={teachers}
                            styles={customSelectStyles}
                            placeholder="เลือกครูผู้ดูแล"
                            className={`font-body ${
                              validationErrors.teachers ? "border-red-500" : ""
                            }`}
                            isDisabled={allTeachersSelected}
                            onChange={(selectedOptions) => {
                              field.onChange(selectedOptions);
                              if (validationErrors.teachers) {
                                setValidationErrors({
                                  ...validationErrors,
                                  teachers: "",
                                });
                              }
                            }}
                          />
                        )}
                      />
                    )}
                    {allTeachersSelected && (
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-color font-body">
                        ครูทุกคนสามารถดูแลกิจกรรมนี้ได้
                      </div>
                    )}
                    {validationErrors.teachers && (
                      <p className="text-red-500 text-xs mt-1 font-body">
                        {validationErrors.teachers}
                      </p>
                    )}
                  </div>

                  {/* Join Limit Toggle Switch */}
                  <div className="sm:col-span-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("joinLimit")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      <span className="ml-3 text-sm font-medium text-text-color font-body">
                        จำกัดการเข้าร่วมกิจกรรม
                      </span>
                    </label>
                  </div>

                  {/* Join Limit Options */}
                  {joinLimit && (
                    <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-text-color mb-3 font-body">
                        ประเภทการจำกัดการเข้าร่วม
                      </p>
                      <div className="flex gap-6 mb-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register("joinLimitType")}
                            value="classroom"
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span className="ml-2 text-text-color font-body">
                            จำกัดตามห้องเรียน
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register("joinLimitType")}
                            value="number"
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span className="ml-2 text-text-color font-body">
                            จำกัดตามจำนวนผู้เข้าร่วม
                          </span>
                        </label>
                      </div>

                      {joinLimitType === "number" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-text-color font-body">
                            จำนวนผู้เข้าร่วมสูงสุด{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            {...register("joinLimitNumber", {
                              required: joinLimitType === "number",
                              min: 1,
                            })}
                            className="w-full sm:w-1/3 rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary focus:ring-primary font-body text-text-color"
                            placeholder="ระบุจำนวน"
                          />
                        </div>
                      )}

                      {joinLimitType === "classroom" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-text-color font-body">
                            ห้องเรียนที่สามารถเข้าร่วมได้{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Controller
                            name="classrooms"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={classrooms}
                                styles={customSelectStyles}
                                placeholder="เลือกห้องเรียน"
                                className="font-body"
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-100">
              <Link
                to="/activities"
                className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-text-color bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                ยกเลิก
              </Link>

              <button
                type="submit"
                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                บันทึกกิจกรรม
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateActivity;

'use client';

import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Select, Spin } from "antd";

import AddStudentForm from "@/components/intructor/ManageStudents/AddStudentForm";
import StudentTable from "@/components/intructor/ManageStudents/StudentTable";

import { useStudentsByClass } from "@/hooks/useStudentsByClass";
import { useClasses } from "@/hooks/useClasses";

const ManageStudentPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>();
    const [instructorId, setInstructorId] = useState<string>();

    // 1️⃣ Lấy instructorId từ localStorage khi component mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        try {
            const user = JSON.parse(storedUser);
            if (user?.id) setInstructorId(user.id);
        } catch (err) {
            console.error("Failed to parse user from localStorage", err);
        }
    }, []);

    // 2️⃣ Lấy danh sách class realtime theo instructorId
    const { classes, loading: classLoading, error: classError } = useClasses(instructorId);

    // 3️⃣ Lấy danh sách students theo class đã chọn
    const { students, loading: studentsLoading } = useStudentsByClass(selectedClass);

    return (
        <div className="flex flex-col">
            <h2 className="text-left font-semibold text-3xl mb-6">
                Manage Student
            </h2>

            {/* FILTER BAR */}
            <div className="flex justify-between p-4 border border-gray-100">
                <div className="text-2xl font-bold">
                    {students.length} students
                </div>

                <div className="flex gap-2">
                    {/* SELECT CLASS */}
                    <Select
                        placeholder={
                            classLoading
                                ? "Loading classes..."
                                : instructorId
                                    ? "Select class"
                                    : "No instructorId"
                        }
                        style={{ width: 200 }}
                        loading={classLoading}
                        value={selectedClass}
                        onChange={setSelectedClass}
                        options={classes.map((cls) => ({
                            value: cls.id,
                            label: cls.name,
                        }))}
                        disabled={classLoading || !instructorId || classes.length === 0}
                    />

                    {/* ADD STUDENT BUTTON */}
                    <button
                        className="text-blue-600 font-semibold bg-blue-50 rounded-sm border border-blue-500 px-4 py-2"
                        onClick={() => setShowForm(true)}
                        disabled={!selectedClass}
                    >
                        + Add Student
                    </button>

                    {/* FILTER UI */}
                    <div className="flex gap-2 bg-gray-50 rounded-sm border border-gray-400 px-4 py-2 items-center">
                        <FaSearch />
                        <span>Filter</span>
                    </div>
                </div>
            </div>

            {/* STUDENT TABLE */}
            {studentsLoading ? (
                <div className="flex justify-center mt-8">
                    <Spin size="large" />
                </div>
            ) : (
                <StudentTable data={students} loading={studentsLoading} />
            )}

            {/* ADD STUDENT MODAL */}
            {showForm && selectedClass && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-3xl relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-3 right-4 text-3xl"
                        >
                            ×
                        </button>

                        <AddStudentForm classId={selectedClass} />
                    </div>
                </div>
            )}

            {/* CLASS ERROR */}
            {classError && (
                <div className="text-red-500 mt-2">
                    Failed to load classes: {classError.message}
                </div>
            )}
        </div>
    );
};

export default ManageStudentPage;

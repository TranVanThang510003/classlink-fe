'use client';

import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import AddStudentForm from "@/components/intructor/ManageStudents/AddStudentForm";
import StudentTable from "@/components/intructor/ManageStudents/StudentTable";
import { Select } from "antd";
import { useStudentsByClass } from "@/hooks/useStudentsByClass";

const ManageStudentPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>();

    const { students, loading } = useStudentsByClass(selectedClass);

    return (
        <div className="flex flex-col">
            <h2 className="text-left font-semibold text-3xl mb-6">Manage Student</h2>

            {/* FILTER BAR */}
            <div className="flex justify-between p-4 border border-gray-100">
                <div className="text-2xl font-bold">
                    {students.length} students
                </div>

                <div className="flex gap-2">
                    <Select
                        placeholder="Select class"
                        style={{ width: 180 }}
                        onChange={setSelectedClass}
                        options={[
                            { value: "10A1", label: "10A1" },
                            { value: "10A2", label: "10A2" },
                        ]}
                    />

                    <button
                        className="text-blue-600 font-semibold bg-blue-50 rounded-sm border border-blue-500 px-4 py-2"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Student
                    </button>

                    <div className="flex gap-2 bg-gray-50 rounded-sm border border-gray-400 px-4 py-2 items-center">
                        <FaSearch />
                        <span>Filter</span>
                    </div>
                </div>
            </div>

            <StudentTable data={students} loading={loading} />

            {/* MODAL */}
            {showForm && (
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
        </div>
    );
};

export default ManageStudentPage;

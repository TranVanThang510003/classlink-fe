'use client';

import { FaSearch } from "react-icons/fa";
import {useEffect, useState} from "react";
import { Spin } from "antd";
import { Skeleton } from "antd";
import CreateStudentForm from "@/components/intructor/ManageStudents/CreateStudentForm";
import StudentTable from "@/components/intructor/ManageStudents/StudentTable";

import { useStudentsByInstructor } from "@/hooks/student/useStudentQuery";


const ManageStudentPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [instructorId, setInstructorId] = useState<string>("");
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        try {
            const user = JSON.parse(storedUser);
            if (user?.id && user.role === "instructor") {
                setInstructorId(user.id);
            }
        } catch (err) {
            console.error("Failed to parse user", err);
        }
    }, []);
    // Lấy TẤT CẢ student account
    const {
        data: students = [],
        isLoading,
        error,
    } = useStudentsByInstructor(instructorId);


   if (!instructorId){
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <Spin size="large" />
          </div>
      );

  }

    return (
        <div className="flex flex-col">
            <h2 className="text-left font-semibold text-3xl mb-6">
                Manage Students
            </h2>

            {/* TOOL BAR */}
            <div className="flex justify-between p-4 border border-gray-100">
                <div className="text-2xl font-bold">
                    {students.length} students
                </div>

                <div className="flex gap-2">
                    {/* ADD STUDENT */}
                    <button
                        className="text-blue-600 font-semibold bg-blue-50 rounded-sm border border-blue-500 px-4 py-2"
                        onClick={() => setShowForm(true)}
                    >
                        + Create Student
                    </button>

                    {/* FILTER (future) */}
                    <div className="flex gap-2 bg-gray-50 rounded-sm border border-gray-400 px-4 py-2 items-center">
                        <FaSearch />
                        <span>Filter</span>
                    </div>
                </div>
            </div>

            {/* STUDENT TABLE */}
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <StudentTable data={students} loading={isLoading} />
            )}

            {/* CREATE STUDENT MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-3xl relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-3 right-4 text-3xl"
                        >
                            ×
                        </button>

                        <CreateStudentForm />
                    </div>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="text-red-500 mt-2">
                    Failed to load students: {error.message}
                </div>
            )}
        </div>
    );
};

export default ManageStudentPage;

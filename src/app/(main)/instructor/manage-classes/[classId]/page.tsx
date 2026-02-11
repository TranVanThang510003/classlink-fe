// 'use client';
//
// import { useState } from "react";
// import { useClasses } from "@/hooks/useClasses";
// import CreateClassModal from "@/components/CreateClassModal";
//
// const CURRENT_INSTRUCTOR_ID = "user_1"; // lấy từ auth
//
// export default function ManageClassesPage() {
//     const { classes, loading } = useClasses(CURRENT_INSTRUCTOR_ID);
//     const [open, setOpen] = useState(false);
//
//     return (
//         <div className="p-6">
//             <div className="flex justify-between mb-4">
//                 <h2 className="text-2xl font-semibold">My Classes</h2>
//                 <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded"
//                     onClick={() => setOpen(true)}
//                 >
//                     + Create Class
//                 </button>
//             </div>
//
//             {loading && <div>Loading...</div>}
//
//             <ul className="space-y-2">
//                 {classes.map((c) => (
//                     <li
//                         key={c.id}
//                         className="p-4 border rounded bg-white"
//                     >
//                         <div className="font-semibold">{c.name}</div>
//                         <div className="text-gray-600 text-sm">
//                             {c.description}
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//
//             <CreateClassModal
//                 open={open}
//                 onClose={() => setOpen(false)}
//                 instructorId={CURRENT_INSTRUCTOR_ID}
//             />
//         </div>
//     );
// }
'use client';

import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import {  Spin } from "antd";

import AddStudentToClassForm from "@/components/intructor/ManageClasses/AddStudentToClassForm";
import StudentTable from "@/components/intructor/ManageStudents/StudentTable";

import { useStudentsByClass } from "@/hooks/student/useStudentsByClass";
import {useAuthContext} from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useClasses } from "@/hooks/class/useClasses";
import { Button } from "antd";

const ManageClassStudentsPage = () => {
    const [showAddStudent, setShowAddStudent] = useState(false);

    const { uid, loading: authLoading } = useAuthContext();

    const params = useParams();
    const classId = params.classId as string;

    const { classes } = useClasses(uid ?? "");
    const activeClass = classes.find(c => c.id === classId);


    const {
        students = [],
        loading: studentsLoading,
    } = useStudentsByClass(classId ?? undefined);

    if (authLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }


    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">
                    Manage Class Students
                </h2>

                {/* BACK BUTTON */}
                <Button
                    onClick={() => history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg
                   hover:bg-gray-50 transition font-medium"
                >
                    ← Back
                </Button>
            </div>


            {/* ===== TOOL BAR ===== */}
            <div className="flex justify-between items-center p-4 border border-gray-100">
                <div className="text-xl font-semibold">
                    {activeClass ? (
                        <>
                            <span className="text-yellow-700">
                                {activeClass.name}
                            </span>
                                            <span className="mx-2 text-gray-400">·</span>
                                            <span>
                                {students.length} students
                            </span>
                        </>
                    ) : (
                        "Select useInstructorQuizzes.ts class to view students"
                    )}
                </div>


                <div className="flex gap-2 items-center">

                    {/* ADD STUDENT */}
                    <button
                        className="text-blue-600 font-semibold bg-blue-50 border border-blue-500 px-4 py-2 rounded"
                        onClick={() => setShowAddStudent(true)}
                        disabled={!classId}
                    >
                        + Add Student
                    </button>

                    {/* FILTER (future) */}
                    <div className="flex gap-2 bg-gray-50 border border-gray-300 px-3 py-2 rounded items-center">
                        <FaSearch/>
                        <span>Filter</span>
                    </div>
                </div>
            </div>

            {/* ===== STUDENT TABLE ===== */}
            {studentsLoading ? (
                <div className="flex justify-center mt-8">
                    <Spin size="large"/>
                </div>
            ) : classId ? (
                <StudentTable data={students} loading={false}/>
            ) : (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class to view students
                </div>

            )}

            {/* ===== ADD STUDENT MODAL ===== */}
            {showAddStudent && classId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-3xl relative">
                        <button
                            onClick={() => setShowAddStudent(false)}
                            className="absolute top-3 right-4 text-3xl"
                        >
                            ×
                        </button>

                        <AddStudentToClassForm classId={classId} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageClassStudentsPage;

"use client";

import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useMyLearningClasses } from "@/hooks/class/useMyLearningClasses";
import { useStudentAssignmentsByClass } from "@/hooks/assignment/useStudentAssignmentsByClass";

import AssignmentList from "@/components/assigments/AssignmentList";

export default function StudentAssignmentPage() {
    const [classId, setClassId] = useState<string>();
    const [user, setUser] = useState<any>(null);

    const auth = getAuth();

    // 🔐 Auth
    useEffect(() => {
        return onAuthStateChanged(auth, setUser);
    }, []);

    const learningClasses = useMyLearningClasses(user?.uid);
    const { assignments, loading } = useStudentAssignmentsByClass(
        classId,
        user?.uid
    );


    if (!user) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold">
                My Assignments
            </h2>

            <div className="flex justify-end">
                <Select
                    placeholder="Select class"
                    value={classId}
                    onChange={setClassId}
                    className="w-64"
                    options={learningClasses.map((c) => ({
                        label: c.name,
                        value: c.id,
                    }))}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : classId ? (
                <AssignmentList assignments={assignments} />
            ) : (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            )}
        </div>
    );
}

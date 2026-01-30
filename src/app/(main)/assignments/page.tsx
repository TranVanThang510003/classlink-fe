"use client";

import {  Spin } from "antd";
import { useStudentAssignmentsByClass } from "@/hooks/assignment/useStudentAssignmentsByClass";

import AssignmentList from "@/components/assigments/AssignmentList";
import {useClassContext} from "@/contexts/ClassContext";
import {useAuthContext} from "@/contexts/AuthContext";

export default function StudentAssignmentPage() {
    const { uid, loading: authLoading } = useAuthContext();
    const { activeClassId } = useClassContext();

    const { assignments, loading } = useStudentAssignmentsByClass(
        activeClassId ?? undefined,
        uid?? undefined
    );


    if (authLoading) {
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


            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : activeClassId? (
                <AssignmentList assignments={assignments} />
            ) : (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            )}
        </div>
    );
}

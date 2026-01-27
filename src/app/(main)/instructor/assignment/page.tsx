"use client";

import { Button, Input, Select, Spin } from "antd";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

import { useMyClasses } from "@/hooks/class/useMyClasses";
import { useAssignmentsByClass} from "@/hooks/assignment/useAssignmentsByClass";
import InstructorAssignmentTable from "@/components/assigments/InstructorAssignmentTable";

export default function InstructorAssignmentsPage() {
    const [classId, setClassId] = useState<string>();

    /* ===== AUTH CONTEXT ===== */
    const {
        uid: instructorId,
        loading: authLoading,
    } = useAuthContext();


    const classes = useMyClasses(instructorId ?? undefined);
    const { assignments, loading } = useAssignmentsByClass(
        classId,
        "instructor"
    );
    /* ===== GUARD (SAU HOOK) ===== */
    if (authLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }


    return (
        <div className="flex flex-col gap-6">
            {/* ===== HEADER ===== */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Assignmnent</h1>

                <Button
                    className="border-yellow-500 text-yellow-500 font-semibold"
                    disabled={!classId}
                >
                    + ADD NEW
                </Button>
            </div>

            {/* ===== FILTER BAR ===== */}
            <div className="flex gap-4 items-center">
                <Select
                    placeholder="Select class"
                    value={classId}
                    onChange={setClassId}
                    className="w-64"
                    options={classes.map((c) => ({
                        label: c.name,
                        value: c.id,
                    }))}
                />


                <Input.Search
                    placeholder="Search Assignment"
                    className="w-72"
                    disabled={!classId}
                />
            </div>

            {/* ===== CONTENT ===== */}
            {!classId ? (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            ) : loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : (
                <InstructorAssignmentTable
                    assignments={assignments}
                />
            )}
        </div>
    );
}

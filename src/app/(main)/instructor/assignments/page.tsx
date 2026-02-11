"use client";

import { Button, Input, Select, Spin } from "antd";
import {useMemo, useState} from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {useInstructorAssignmentsByClass} from "@/hooks/assignment/useInstructorAssignmentsByClass";
import InstructorAssignmentTable from "@/components/assigments/InstructorAssignmentTable";
import CreateAssignmentModal from "@/components/assigments/CreateAssignmentModal";
import {useClassContext} from "@/contexts/ClassContext";

export default function InstructorAssignmentsPage() {
    const [openCreate, setOpenCreate] = useState(false);

    /* ===== AUTH CONTEXT ===== */
    const {
        loading: authLoading,
    } = useAuthContext();
    const { activeClassId } = useClassContext()
    const { assignments, loading } = useInstructorAssignmentsByClass(
        activeClassId ?? undefined,
    );

    const [keyword, setKeyword] = useState("");

    // filter client-side
    const filteredAsignments = useMemo(() => {
        return assignments
            .filter((d) =>
                d.title.toLowerCase().includes(keyword.toLowerCase())
            );
    }, [assignments, keyword]);
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
                    disabled={!activeClassId}
                    onClick={() => setOpenCreate(true)}
                >
                    + ADD NEW
                </Button>
            </div>

            {/* ===== FILTER BAR ===== */}
            <div className="flex gap-4 items-center">

                <Input.Search
                    placeholder="Search Assignment"
                    className="w-72"
                    disabled={!activeClassId}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* ===== CONTENT ===== */}
            {!activeClassId ? (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class
                </div>
            ) : loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : (
                <InstructorAssignmentTable
                    assignments={filteredAsignments}
                />
            )}
            <CreateAssignmentModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                classId={activeClassId}
            />

        </div>
    );
}

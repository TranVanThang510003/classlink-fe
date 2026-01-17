"use client";

import { Button, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useMyClasses } from "@/hooks/useMyClasses";
import { useAssignmentsByClass } from "@/hooks/useAssignmentsByClass";

import AssignmentList from "@/components/assigments/AssignmentList";
import CreateAssignmentModal from "@/components/assigments/CreateAssignmentModal";

export default function AssignmentManagementPage() {
    const [classId, setClassId] = useState<string>();
    const [user, setUser] = useState<any>(null);
    const [openCreate, setOpenCreate] = useState(false);

    const auth = getAuth();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsub();
    }, []);

    const instructorId = user?.uid;

    const classes = useMyClasses(instructorId);
    const { assignments, loading } = useAssignmentsByClass(classId);

    // ===== AUTH LOADING =====
    if (!user) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* ===== HEADER ===== */}
            <div>
                <h2 className="text-3xl font-semibold mb-6">
                    Manage Assignments
                </h2>

                <div className="flex gap-3 justify-end">
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

                    <Button
                        type="primary"
                        onClick={() => setOpenCreate(true)}
                        disabled={!classId}
                    >
                        + Create Assignment
                    </Button>
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : classId ? (
                <AssignmentList assignments={assignments} />
            ) : (
                <div className="text-center text-gray-400 italic mt-10">
                    Please select a class to manage assignments
                </div>
            )}

            {/* ===== MODAL ===== */}
            <CreateAssignmentModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                classId={classId}
            />
        </div>
    );
}
